import fp from "fastify-plugin";
import { v4 } from "uuid";
import { TResponse as getDevicesSchema } from "./schema/getDeviceSchema";
import {
  TResponse as createCompanyResponse,
  TBody as createDeviceBody,
} from "./schema/createDeviceSchema";
import { decodeType } from "../../plugins/authenticate";
import { TBody as UpdateDeviceBody } from "./schema/updateDeviceSchema";
import { TResponse as GetDeviceByIdResponse } from "./schema/getDeviceByIdSchema";
import { TResponse as DeleteDeviceResponse } from "./schema/deleteDeviceSchema";

export default fp(async (fastify) => {
  const getDevices = async (userInfo: decodeType) => {
    const result = await fastify.mongo
      .collection("devices")
      .find({
        companyId: userInfo.companyId,
      })
      .toArray();

    for (const item of result) {
      if (item.deviceType === "lock" && item.brand === "ttlock") {
        try {
          await fastify.ttlockService.sync(item.deviceId);
        } catch (error) {
          console.error("Failed to sync device:", error);
        }
      }
    }

    return result;
  };

  const createDevice = async (userInfo: decodeType, data: createDeviceBody) => {
    if (data.length === 0) {
      return { status: "failed", message: "No data" };
    }

    const isFound = await fastify.mongo.collection("devices").findOne({
      deviceId: data[0].deviceId,
    });
    if (isFound) {
      return { status: "failed", message: "Device already exists" };
    }
    const payload = data.map((item: any) => {
      const id = v4();
      return {
        ...item,
        id,
        companyId: userInfo.companyId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });

    try {
      await fastify.mongo.collection("devices").insertMany(payload);
      for (const item of payload) {
        const result = await fastify.ttlockService.sync(item.deviceId, true);
        console.log({ result });
      }

      return { status: "success", message: "inserted successfully" };
    } catch (error: any) {
      console.error("Failed to insert device:", error);
      return {
        status: "failed",
        message: "Failed to insert device: " + error.message,
      };
    }
  };

  const getDeviceById = async (userInfo: decodeType, id: string) => {
    try {
      const device = await fastify.mongo.collection("devices").findOne({
        id,
        companyId: userInfo.companyId,
      });

      if (!device) {
        throw new Error("Device not found");
      }

      if (device.deviceType === "lock" && device.brand === "ttlock") {
        try {
          await fastify.ttlockService.sync(device.deviceId);
        } catch (error) {
          console.error("Failed to sync device:", error);
        }
      }

      return device;
    } catch (error: any) {
      console.error("Failed to get device:", error);
      throw new Error(`Failed to get device: ${error.message}`);
    }
  };

  const updateDevice = async (
    userInfo: decodeType,
    id: string,
    data: Partial<createDeviceBody[0]>
  ) => {
    try {
      const result = await fastify.mongo.collection("devices").updateOne(
        { id, companyId: userInfo.companyId },
        {
          $set: {
            ...data,
            updatedAt: new Date().toISOString(),
          },
        }
      );

      if (result.matchedCount === 0) {
        throw new Error("Device not found");
      }

      return { status: "success", message: "Device updated successfully" };
    } catch (error: any) {
      console.error("Failed to update device:", error);
      throw new Error(`Failed to update device: ${error.message}`);
    }
  };

  const deleteDevice = async (userInfo: decodeType, id: string) => {
    try {
      const result = await fastify.mongo
        .collection("devices")
        .updateOne(
          { id, companyId: userInfo.companyId },
          { $set: { isActive: false, updatedAt: new Date().toISOString() } }
        );

      if (result.matchedCount === 0) {
        throw new Error("Device not found");
      }

      return { status: "success", message: "Device deleted successfully" };
    } catch (error: any) {
      console.error("Failed to delete device:", error);
      throw new Error(`Failed to delete device: ${error.message}`);
    }
  };

  // Decorate the fastify instance with the departmentService
  // @ts-ignore
  fastify.decorate("devicesService", {
    getDevices,
    getDeviceById,
    createDevice,
    updateDevice,
    deleteDevice,
  });
});

declare module "fastify" {
  interface FastifyInstance {
    devicesService: {
      getDevices: (userInfo: decodeType) => Promise<getDevicesSchema | null>;
      getDeviceById: (
        userInfo: decodeType,
        id: string
      ) => Promise<GetDeviceByIdResponse | null>;
      createDevice: (
        userInfo: decodeType,
        data: createDeviceBody
      ) => Promise<createCompanyResponse | null>;
      updateDevice: (
        userInfo: decodeType,
        id: string,
        data: UpdateDeviceBody
      ) => Promise<{ status: string; message: string } | null>;
      deleteDevice: (
        userInfo: decodeType,
        id: string
      ) => Promise<DeleteDeviceResponse | null>;
    };
  }
}
