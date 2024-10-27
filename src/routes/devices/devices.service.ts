import fp from "fastify-plugin";

import { TResponse as getDevicesSchema } from "./schema/getDeviceSchema";
import {
  TResponse as createCompanyResponse,
  TBody as createDeviceBody,
} from "./schema/createDeviceSchema";

export default fp(async (fastify) => {
  const getDevices = async () => {
    const result = await fastify.mongo.collection("devices").find().toArray();

    return result;
  };

  const createDevice = async (data: createDeviceBody) => {
    console.log(data); // Ensure sensitive data is handled securely in production

    const payload = {
      companyId: data.companyId,
      entityId: data?.entityId || null,
      deviceType: data.deviceType,
      brand: data.brand,
      isPublic: data.isPublic,
      isConnectedToNetwork: data.isConnectedToNetwork,
      status: data.status,
      lastMaintenanceDate: data.lastMaintenanceDate,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    try {
      const result = await fastify.mongo
        .collection("devices")
        .insertOne(payload);
      console.log("Insert successful:", result);
      return { id: result.insertedId };
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
      getDevices: () => Promise<getDevicesSchema | null>;
      createDevice: (
        data: createDeviceBody
      ) => Promise<createCompanyResponse | null>;
    };
  }
}
