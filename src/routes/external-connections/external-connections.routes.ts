import { FastifyRequest } from "fastify";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { createExternalConnectionSchema } from "./schema/createExternalConnectionSchema";
import { getExternalConnectionsSchema } from "./schema/getExternalConnectionsSchema";
import { getExternalConnectionByIdSchema } from "./schema/getExternalConnectionByIdSchema";
import { deleteExternalConnectionSchema } from "./schema/deleteExternalConnectionSchema";

const externalConnections: FastifyPluginAsyncTypebox = async (
  fastify: any
): Promise<void> => {
  fastify.route({
    method: "GET",
    url: "/",
    schema: getExternalConnectionsSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: FastifyRequest) => {
      const decoded = fastify.decode(request.headers.authorization);
      return await fastify.externalConnectionsService.getConnections(decoded);
    },
  });

  fastify.route({
    method: "POST",
    url: "/",
    schema: createExternalConnectionSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: FastifyRequest) => {
      const { body } = request;
      const decoded = fastify.decode(request.headers.authorization);
      return await fastify.externalConnectionsService.createConnection(
        decoded,
        body
      );
    },
  });

  fastify.route({
    method: "GET",
    url: "/:id",
    schema: getExternalConnectionByIdSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: FastifyRequest) => {
      const { id } = request.params as { id: string };
      const decoded = fastify.decode(request.headers.authorization);
      return await fastify.externalConnectionsService.getConnectionById(
        decoded,
        id
      );
    },
  });

  fastify.route({
    method: "DELETE",
    url: "/:id",
    schema: deleteExternalConnectionSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: FastifyRequest) => {
      const { id } = request.params as { id: string };
      const decoded = fastify.decode(request.headers.authorization);
      return await fastify.externalConnectionsService.deleteConnection(
        decoded,
        id
      );
    },
  });
};

export default externalConnections;
