import fp from "fastify-plugin";
import { v4 } from "uuid";
import { TBody } from "./schema/createExternalConnectionSchema";
import { decodeType } from "../../plugins/authenticate";
import crypto from "crypto";

const encryptPayload = (payload: any, secretKey: string) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    Buffer.from(secretKey, "hex"),
    iv
  );

  let encrypted = cipher.update(JSON.stringify(payload), "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return {
    encrypted,
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
  };
};

const decryptPayload = (
  encryptedData: { encrypted: string; iv: string; authTag: string },
  secretKey: string
) => {
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    Buffer.from(secretKey, "hex"),
    Buffer.from(encryptedData.iv, "hex")
  );

  decipher.setAuthTag(Buffer.from(encryptedData.authTag, "hex"));

  let decrypted = decipher.update(encryptedData.encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return JSON.parse(decrypted);
};

export default fp(async (fastify) => {
  const ENCRYPTION_KEY =
    process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString("hex");

  const getConnections = async (userInfo: decodeType) => {
    try {
      const results = await fastify.mongo
        .collection("ExternalConnections")
        .find({
          companyId: userInfo.companyId,
        })
        .toArray();

      return results.map((result) => ({
        ...result,
        payload: decryptPayload(result.payload, ENCRYPTION_KEY),
      }));
    } catch (error: any) {
      console.error("Failed to get connections:", error);
      throw new Error(`Failed to get connections: ${error.message}`);
    }
  };

  const createConnection = async (userInfo: decodeType, data: TBody) => {
    try {
      const encryptedPayload = encryptPayload(data.payload, ENCRYPTION_KEY);

      const payload = {
        id: v4(),
        companyId: userInfo.companyId,
        type: data.type,
        payload: encryptedPayload,
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
        payload: decryptPayload(result.payload, ENCRYPTION_KEY),
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
