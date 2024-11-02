import fp from "fastify-plugin";

import { TResponse as getDevicesSchema } from "./schema/getDeviceSchema";
import {
  TResponse as createCompanyResponse,
  TBody as createDeviceBody,
} from "./schema/createDeviceSchema";
import { decodeType } from "../../plugins/authenticate";

export default fp(async (fastify) => {
  const getDevices = async (userInfo: decodeType) => {
    const result = await fastify.mongo.collection("devices").find().toArray();

    return result;
  };

  const createDevice = async (userInfo: decodeType, data: createDeviceBody) => {
    console.log(data); // Ensure sensitive data is handled securely in production

    if (data.length === 0) {
      throw new Error("No data provided");
    }

    const payload = data.map((item) => {
      return {
        ...item,
        companyId: userInfo.companyId,
        createdAt: new Date().toISOString(),
        createdBy: userInfo.email,
      };
    });

    try {
      const result = await fastify.mongo
        .collection("devices")
        .insertMany(payload);
      console.log("Insert successful:", result);
      return { message: "inserted successfully" };
    } catch (error: any) {
      console.error("Failed to insert unit:", error);
      throw new Error("Failed to insert unit: " + error.message);
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
