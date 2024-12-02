import fp from "fastify-plugin";

import { TResponse as getUnitsSchema } from "./schema/getUnitsSchema";
import {
  TResponse as createCompanyResponse,
  TBody as createUnitBody,
} from "./schema/createUnitSchema";
import { decodeType } from "../../plugins/authenticate";

import { v4 } from "uuid";

export default fp(async (fastify) => {
  const getUnits = async () => {
    const result = await fastify.mongo
      .collection("units")
      .aggregate([
        {
          $lookup: {
            from: "entities", // The collection to join with
            localField: "entityId", // The field in "units" to match
            foreignField: "id", // The field in "entities" to match
            as: "entityDetails", // The name of the joined field in the result
          },
        },
        {
          $unwind: {
            path: "$entityDetails", // Unwind the joined results to get a flat structure
            preserveNullAndEmptyArrays: true, // Keep units without matching entities
          },
        },
        {
          $project: {
            _id: 0, // Exclude the MongoDB `_id` field if not needed
            id: 1,
            name: 1,
            entityId: 1,
            isPublic: 1,
            lastMaintenanceDate: 1,
            updatedAt: 1,
            createdAt: 1,
            "entityDetails.name": 1, // Include specific fields from `entityDetails`
            "entityDetails.description": 1,
            "entityDetails.lat": 1,
            "entityDetails.lng": 1,
          },
        },
      ])
      .toArray();

    console.log(result);
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

  const updateUnit = async (id: string, data: createUnitBody) => {
    // update company with given keys and values
    const payload = {
      $set: {
        ...data,
        updatedAt: new Date().toISOString(),
      },
    };

    try {
      await fastify.mongo.collection("units").updateOne({ id: id }, payload);

      return { status: "success", message: "updated successfully" };
    } catch (error: any) {
      console.error("Failed to update company:", error);
      return { message: "Failed to update company: " + error.message };
    }
  };

  const getUnitById = async (id: string) => {
    const result = await fastify.mongo.collection("units").findOne({
      id,
    });

    return result;
  };

  const createUnit = async (userInfo: decodeType, data: createUnitBody) => {
    const payload = {
      id: v4(),
      companyId: userInfo?.companyId,
      entityId: data?.entityId,
      name: data.name,
      isPublic: data.isPublic,
      lastMaintenanceDate: data.lastMaintenanceDate,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    console.log(payload);
    try {
      await fastify.mongo.collection("units").insertOne(payload);
      return { status: "success", message: "inserted successfully" };
    } catch (error: any) {
      console.error("Failed to insert unit:", error);
      return { message: "Failed to insert unit: " + error.message };
    }
  };

  // Decorate the fastify instance with the departmentService
  // @ts-ignore
  fastify.decorate("unitsService", {
    getUnits,
    createUnit,
    getUnitsByEntityId,
    getUnitById,
    updateUnit,
  });
});

declare module "fastify" {
  interface FastifyInstance {
    unitsService: {
      getUnits: (userInfo: decodeType) => Promise<getUnitsSchema | null>;
      getUnitsByEntityId: (entityId: string) => Promise<getUnitsSchema | null>;
      getUnitById: (id: string) => Promise<getUnitsSchema | null>;
      updateUnit: (
        id: string,
        data: createUnitBody
      ) => Promise<createCompanyResponse | null>;
      createUnit: (
        userInfo: decodeType,
        data: createUnitBody
      ) => Promise<createCompanyResponse | null>;
    };
  }
}
