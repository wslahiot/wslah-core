import fp from "fastify-plugin";
import { v4 } from "uuid";
import { TResponse as getUnitConfigSchema } from "./schema/getUnitConfigSchema";
import { TBody as createUnitConfigBody } from "./schema/createUnitConfigSchema";
import { decodeType } from "../../plugins/authenticate";
import { TBody as UpdateUnitConfigBody } from "./schema/updateUnitConfigSchema";
// import { TResponse as GetUnitConfigByIdResponse } from "./schema/getUnitConfigByIdSchema";
// import { TResponse as DeleteUnitConfigResponse } from "./schema/dele";

export default fp(async (fastify) => {
  const getUnitConfigs = async (userInfo: decodeType, unitId: string) => {
    const result = await fastify.mongo
      .collection("unitConfig")
      .find({
        unitId,
      })
      .toArray();

    return {
      status: "success",
      message: "Unit configurations found",
      data: result,
    };
  };

  const createUnitConfig = async (
    userInfo: decodeType,
    data: createUnitConfigBody
  ) => {
    const id = v4();
    const payload = {
      id,
      companyId: userInfo.companyId,
      ...data,

      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      //
    };

    try {
      await fastify.mongo.collection("unitConfig").insertOne(payload);
      return {
        status: "success",
        message: "Unit configuration created successfully",
      };
    } catch (error: any) {
      console.error("Failed to create unit configuration:", error);
      return {
        status: "failed",
        message: "Failed to create unit configuration",
        error: error.message,
      };
    }
  };

  const getUnitConfigById = async (id: string) => {
    try {
      const unitConfig = await fastify.mongo.collection("unitConfig").findOne({
        unitId: id,
      });

      if (!unitConfig) {
        return {
          status: "failed",
          message: "Unit configuration not found",
        };
      }

      return {
        status: "success",
        message: "Unit configuration found",
        data: unitConfig,
      };
    } catch (error: any) {
      console.error("Failed to get unit configuration:", error);

      return {
        status: "failed",
        message: "Failed to get unit configuration",
        error: error.message,
      };
    }
  };

  const updateUnitConfig = async (
    id: string,
    data: Partial<UpdateUnitConfigBody>
  ) => {
    try {
      const result = await fastify.mongo.collection("unitConfig").updateOne(
        { unitId: id },
        {
          $set: {
            ...data,
            updatedAt: new Date().toISOString(),
          },
        }
      );

      if (result.matchedCount === 0) {
        return {
          status: "failed",
          message: "Unit configuration not found",
          error: "Unit configuration not found",
        };
      }

      return {
        status: "success",
        message: "Unit configuration updated successfully",
      };
    } catch (error: any) {
      console.error("Failed to update unit configuration:", error);
      return {
        status: "failed",
        message: "Failed to update unit configuration",
        error: error.message,
      };
    }
  };

  //   const deleteUnitConfig = async (userInfo: decodeType, id: string) => {
  //     try {
  //       const result = await fastify.mongo.collection("unitConfig").updateOne(
  //         { id, companyId: userInfo.companyId, isActive: true },
  //         {
  //           $set: {
  //             isActive: false,
  //             updatedAt: new Date().toISOString(),
  //           },
  //         }
  //       );

  //       if (result.matchedCount === 0) {
  //         throw new Error("Unit configuration not found");
  //       }

  //       return {
  //         status: "success",
  //         message: "Unit configuration deleted successfully",
  //       };
  //     } catch (error: any) {
  //       console.error("Failed to delete unit configuration:", error);
  //       throw new Error(`Failed to delete unit configuration: ${error.message}`);
  //     }
  //   };

  fastify.decorate("unitConfigService", {
    getUnitConfigs,
    getUnitConfigById,
    createUnitConfig,
    updateUnitConfig,
    // deleteUnitConfig,
  } as any);
});

declare module "fastify" {
  interface FastifyInstance {
    unitConfigService: {
      getUnitConfigs: (
        userInfo: decodeType,
        unitId: string
      ) => Promise<getUnitConfigSchema | null>;
      getUnitConfigById: (
        // userInfo: decodeType,
        id: string
      ) => Promise<any>;
      createUnitConfig: (
        userInfo: decodeType,
        data: createUnitConfigBody
      ) => Promise<{ status: string; message: string }>;
      updateUnitConfig: (
        id: string,
        data: UpdateUnitConfigBody
      ) => Promise<{ status: string; message: string }>;
      //   deleteUnitConfig: (
      //     userInfo: decodeType,
      //     id: string
      //   ) => Promise<DeleteUnitConfigResponse>;
    };
  }
}
