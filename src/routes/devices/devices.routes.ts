import { FastifyRequest } from "fastify";
import { createDeviceSchema } from "./schema/createDeviceSchema";
import { getDeviceSchema } from "./schema/getDeviceSchema";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

const entity: FastifyPluginAsyncTypebox = async (
  fastify: any
): Promise<void> => {
  // api to get specific user
  fastify.route({
    method: "GET",
    url: "/",
    schema: getDeviceSchema,
    // preHandler: [fastify.authenticate],
    handler: async (request: any) => {
      const decoded = fastify.decode(request.headers.authorization);
      return await fastify.devicesService.getDevices(decoded);
    },
  });

  fastify.route({
    method: "POST",
    url: "/",
    schema: createDeviceSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: FastifyRequest) => {
      const { body } = request;
      const decoded = fastify.decode(request.headers.authorization);
      return await fastify.devicesService.createDevice(decoded, body);
    },
  });
};

export default entity;
