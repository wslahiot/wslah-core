import fp from "fastify-plugin";

import { TResponse as getUnitsSchema } from "./schema/getUnitsSchema";
import {
  TResponse as createCompanyResponse,
  TBody as createUnitBody,
} from "./schema/createUnitSchema";

export default fp(async (fastify) => {
  const getUnits = async () => {
    const result = await fastify.mongo.collection("entities").find().toArray();

    return result;
  };

  const createUnit = async (data: createUnitBody) => {
    console.log(data); // Ensure sensitive data is handled securely in production
    const payload = {
      entityId: data.entityId,
      unitName: data.unitName,
      unitType: data.unitType,
      isPublic: data.isPublic,
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
  });
});

declare module "fastify" {
  interface FastifyInstance {
    unitsService: {
      getUnits: () => Promise<getUnitsSchema | null>;
      createUnit: (
        data: createUnitBody
      ) => Promise<createCompanyResponse | null>;
    };
  }
}
