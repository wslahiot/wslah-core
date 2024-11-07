import fp from "fastify-plugin";

import { TResponse as getUnitsSchema } from "./schema/getUnitsSchema";
import {
  TResponse as createCompanyResponse,
  TBody as createUnitBody,
} from "./schema/createUnitSchema";
import { decodeType } from "../../plugins/authenticate";
import { ObjectId } from "mongodb";

export default fp(async (fastify) => {
  const getUnits = async () => {
    const result = await fastify.mongo.collection("units").find({}).toArray();

    return result;
  };

  const getUnitsByEntityId = async (entityId: string) => {
    const result = await fastify.mongo
      .collection("units")
      .find({
        entityId: entityId,
      })
      .toArray();

    return result;
  };

  const getUnitById = async (id: string) => {
    const result = await fastify.mongo.collection("units").findOne({
      _id: new ObjectId(id),
    });

    return result;
  };

  const createUnit = async (userInfo: decodeType, data: createUnitBody) => {
    const payload = {
      _id: new ObjectId(),
      companyId: userInfo?.companyId,
      entityId: data?.entityId,
      name: data.name,
      isPublic: data.isPublic,
      lastMaintenanceDate: data.lastMaintenanceDate,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    try {
      const result = await fastify.mongo.collection("units").insertOne(payload);
      console.log("Insert successful:", result);
      return { id: result.insertedId };
    } catch (error: any) {
      console.error("Failed to insert unit:", error);
      throw new Error("Failed to insert unit: " + error.message);
    }
  };

  // Decorate the fastify instance with the departmentService
  // @ts-ignore
  fastify.decorate("unitsService", {
    getUnits,
    createUnit,
    getUnitsByEntityId,
    getUnitById,
  });
});

declare module "fastify" {
  interface FastifyInstance {
    unitsService: {
      getUnits: (userInfo: decodeType) => Promise<getUnitsSchema | null>;
      getUnitsByEntityId: (entityId: string) => Promise<getUnitsSchema | null>;
      getUnitById: (id: string) => Promise<getUnitsSchema | null>;
      createUnit: (
        userInfo: decodeType,
        data: createUnitBody
      ) => Promise<createCompanyResponse | null>;
    };
  }
}
