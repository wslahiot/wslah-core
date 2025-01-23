import fp from "fastify-plugin";

import { TGetUnitsResponse } from "./schema/getUnitsSchema";
import {
  TCreateUnitBody,
  TCreateUnitResponse,
} from "./schema/createUnitSchema";
import { TUpdateUnitBody } from "./schema/updateUnitSchema";
import { decodeType } from "../../plugins/authenticate";
import { v4 } from "uuid";

export default fp(async (fastify) => {
  const getUnits = async (userInfo: decodeType) => {
    try {
      const result = await fastify.mongo
        .collection("units")
        .aggregate([
          { $match: { companyId: userInfo.companyId } },
          {
            $addFields: {
              unitId: "$id",
            },
          },
          {
            $lookup: {
              from: "unitConfig",
              localField: "id",
              foreignField: "unitId",
              as: "unitDetails",
            },
          },
          {
            $addFields: {
              imagePath: { $arrayElemAt: ["$unitDetails.imagePath", 0] },
            },
          },
          {
            $project: {
              unitDetails: 0, // Remove the unitDetails array since we've extracted imagePath
            },
          },
        ])
        .toArray();
      return result;
    } catch (error: any) {
      console.error("Failed to get units:", error);
      throw new Error(`Failed to get units: ${error.message}`);
    }
  };

  const getUnitById = async (userInfo: decodeType, id: string) => {
    try {
      const unit = await fastify.mongo
        .collection("units")
        .findOne({ id, companyId: userInfo.companyId });

      if (!unit) {
        throw new Error("Unit not found");
      }
      return unit;
    } catch (error: any) {
      console.error("Failed to get unit:", error);
      throw new Error(`Failed to get unit: ${error.message}`);
    }
  };

  const createUnit = async (userInfo: decodeType, data: TCreateUnitBody) => {
    try {
      const payload = {
        id: v4(),
        companyId: userInfo?.companyId,
        entityId: data?.entityId,
        name: data.name,

        lastMaintenanceDate: data.lastMaintenanceDate,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      console.log(payload);
      await fastify.mongo.collection("units").insertOne(payload);
      return { status: "success", message: "inserted successfully" };
    } catch (error: any) {
      console.error("Failed to insert unit:", error);
      return { message: "Failed to insert unit: " + error.message };
    }
  };

  const updateUnit = async (
    userInfo: decodeType,
    id: string,
    data: TUpdateUnitBody
  ) => {
    try {
      const result = await fastify.mongo
        .collection("units")
        .updateOne(
          { id, companyId: userInfo.companyId },
          { $set: { ...data, updatedAt: new Date().toISOString() } }
        );

      if (result.matchedCount === 0) {
        throw new Error("Unit not found");
      }

      // Fetch the updated document
      const updatedUnit = await fastify.mongo
        .collection("units")
        .findOne({ id, companyId: userInfo.companyId });

      return {
        status: "success",
        message: "Unit updated successfully",
        data: updatedUnit,
      };
    } catch (error: any) {
      console.error("Failed to update unit:", error);
      throw new Error(`Failed to update unit: ${error.message}`);
    }
  };

  const deleteUnit = async (userInfo: decodeType, id: string) => {
    try {
      const result = await fastify.mongo
        .collection("units")
        .updateOne(
          { id, companyId: userInfo.companyId },
          { $set: { isActive: false, updatedAt: new Date().toISOString() } }
        );

      if (result.matchedCount === 0) {
        throw new Error("Unit not found");
      }
      return { status: "success", message: "Unit deleted successfully" };
    } catch (error: any) {
      console.error("Failed to delete unit:", error);
      throw new Error(`Failed to delete unit: ${error.message}`);
    }
  };

  // Decorate the fastify instance with the departmentService
  // @ts-ignore
  fastify.decorate("unitsService", {
    getUnits,
    createUnit,
    getUnitById,
    updateUnit,
    deleteUnit,
  });
});

declare module "fastify" {
  interface FastifyInstance {
    unitsService: {
      getUnits: (userInfo: decodeType) => Promise<TGetUnitsResponse | null>;
      getUnitById: (
        userInfo: decodeType,
        id: string
      ) => Promise<TGetUnitsResponse | null>;
      createUnit: (
        userInfo: decodeType,
        data: TCreateUnitBody
      ) => Promise<TCreateUnitResponse | null>;
      updateUnit: (
        userInfo: decodeType,
        id: string,
        data: TCreateUnitBody
      ) => Promise<TCreateUnitResponse | null>;
      deleteUnit: (
        userInfo: decodeType,
        id: string
      ) => Promise<TCreateUnitResponse | null>;
    };
  }
}
