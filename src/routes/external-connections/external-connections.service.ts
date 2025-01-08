import fp from "fastify-plugin";
import { v4 } from "uuid";
import { TBody } from "./schema/createExternalConnectionSchema";
import { decodeType } from "../../plugins/authenticate";

export default fp(async (fastify) => {
  const getConnections = async (userInfo: decodeType) => {
    try {
      const results = await fastify.mongo
        .collection("ExternalConnections")
        .find({
          companyId: userInfo.companyId,
        })
        .toArray();

      return results.map(async (result) => ({
        ...result,
        payload: await fastify.decryptPayload(result.payload),
      }));
    } catch (error: any) {
      console.error("Failed to get connections:", error);
      throw new Error(`Failed to get connections: ${error.message}`);
    }
  };

  const createConnection = async (userInfo: decodeType, data: TBody) => {
    try {
      const payload = {
        id: v4(),
        companyId: userInfo.companyId,
        type: data.type,
        payload: await fastify.encryptPayload(data.payload),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await fastify.mongo.collection("ExternalConnections").insertOne(payload);

      return { status: "success", message: "Connection created successfully" };
    } catch (error: any) {
      console.error("Failed to create connection:", error);
      throw new Error(`Failed to create connection: ${error.message}`);
    }
  };

  const getConnectionById = async (userInfo: decodeType, id: string) => {
    try {
      const result = await fastify.mongo
        .collection("ExternalConnections")
        .findOne({
          id,
          companyId: userInfo.companyId,
        });

      if (!result) {
        throw new Error("Connection not found");
      }

      return {
        ...result,
        payload: await fastify.decryptPayload(result.payload),
      };
    } catch (error: any) {
      console.error("Failed to get connection:", error);
      throw new Error(`Failed to get connection: ${error.message}`);
    }
  };

  const deleteConnection = async (userInfo: decodeType, id: string) => {
    try {
      const result = await fastify.mongo
        .collection("ExternalConnections")
        .deleteOne({
          id,
          companyId: userInfo.companyId,
        });

      if (result.deletedCount === 0) {
        throw new Error("Connection not found");
      }

      return { status: "success", message: "Connection deleted successfully" };
    } catch (error: any) {
      console.error("Failed to delete connection:", error);
      throw new Error(`Failed to delete connection: ${error.message}`);
    }
  };

  fastify.decorate("externalConnectionsService", {
    getConnections,
    createConnection,
    getConnectionById,
    deleteConnection,
  });
});

declare module "fastify" {
  interface FastifyInstance {
    externalConnectionsService: {
      getConnections: (userInfo: decodeType) => Promise<any>;
      createConnection: (userInfo: decodeType, data: TBody) => Promise<any>;
      getConnectionById: (userInfo: decodeType, id: string) => Promise<any>;
      deleteConnection: (userInfo: decodeType, id: string) => Promise<any>;
    };
  }
}
