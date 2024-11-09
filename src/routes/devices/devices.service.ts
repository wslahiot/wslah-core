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
      throw new Error("No data provided");
    }

    const isFound = await fastify.mongo.collection("devices").findOne({
      deviceId: data[0].deviceId,
    });
    if (isFound) {
      throw new Error("Device already exists");
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
      await fastify.ttlockService.sync(item.deviceId);
      return { message: "Inserted successfully" };
    } catch (error: any) {
      console.error("Failed to insert device:", error);
      throw new Error("Failed to insert device: " + error.message);
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
