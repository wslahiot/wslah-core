import { FastifyRequest } from "fastify";
import { createDeviceSchema } from "./schema/createDeviceSchema";
import { getDeviceSchema } from "./schema/getDeviceSchema";
import { getDeviceByIdSchema } from "./schema/getDeviceByIdSchema";
import { deleteDeviceSchema } from "./schema/deleteDeviceSchema";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { updateDeviceSchema } from "./schema/updateDeviceSchema";

const entity: FastifyPluginAsyncTypebox = async (
  fastify: any
): Promise<void> => {
  // api to get specific user
  fastify.route({
    method: "GET",
    url: "/",
    schema: getDeviceSchema,
    preHandler: [fastify.authenticate],
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

  fastify.route({
    method: "PUT",
    url: "/:id",
    schema: updateDeviceSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: FastifyRequest) => {
      const { id } = request.params as { id: string };
      const { body } = request;
      const decoded = fastify.decode(request.headers.authorization);
      return await fastify.devicesService.updateDevice(decoded, id, body);
    },
  });

  fastify.route({
    method: "DELETE",
    url: "/:id",
    schema: deleteDeviceSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: FastifyRequest) => {
      const { id } = request.params as { id: string };
      const decoded = fastify.decode(request.headers.authorization);
      return await fastify.devicesService.deleteDevice(decoded, id);
    },
  });

  fastify.route({
    method: "GET",
    url: "/:id",
    schema: getDeviceByIdSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: FastifyRequest) => {
      const { id } = request.params as { id: string };
      const decoded = fastify.decode(request.headers.authorization);
      return await fastify.devicesService.getDeviceById(decoded, id);
    },
  });
};

export default entity;
