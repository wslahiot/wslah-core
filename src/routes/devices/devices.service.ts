import fp from "fastify-plugin";
import { v4 } from "uuid";
import { TResponse as getDevicesSchema } from "./schema/getDeviceSchema";
import {
  TResponse as createCompanyResponse,
  TBody as createDeviceBody,
} from "./schema/createDeviceSchema";
import { decodeType } from "../../plugins/authenticate";

export default fp(async (fastify) => {
  const getDevices = async (userInfo: decodeType) => {
    const result = await fastify.mongo
      .collection("devices")
      .find({
        companyId: userInfo.companyId,
      })
      .toArray();

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
        const result = await fastify.ttlockService.sync(item.deviceId);
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
  // Decorate the fastify instance with the departmentService
  // @ts-ignore
  fastify.decorate("devicesService", {
    getDevices,
    createDevice,
  });
});

declare module "fastify" {
  interface FastifyInstance {
    devicesService: {
      getDevices: (userInfo: decodeType) => Promise<getDevicesSchema | null>;
      createDevice: (
        userInfo: decodeType,
        data: createDeviceBody
      ) => Promise<createCompanyResponse | null>;
    };
  }
}
