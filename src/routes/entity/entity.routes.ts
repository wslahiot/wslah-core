import { FastifyRequest } from "fastify";
import { createEntitySchema } from "./schema/createEntitiySchema";
import { getEntitySchema } from "./schema/getEntitySchema";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { updateEntitySchema } from "./schema/updateEntitySchema";

const entity: FastifyPluginAsyncTypebox = async (
  fastify: any
): Promise<void> => {
  // api to get specific user
  fastify.route({
    method: "GET",
    url: "/",
    schema: getEntitySchema,
    preHandler: [fastify.authenticate],
    handler: async () => {
      return await fastify.entityService.getEntities();
    },
  });

  fastify.route({
    method: "POST",
    url: "/",
    schema: createEntitySchema,
    preHandler: [fastify.authenticate],
    handler: async (request: FastifyRequest) => {
      const { body } = request;
      const decoded = fastify.decode(request.headers.authorization);
      return await fastify.entityService.createEntity(decoded, body);
    },
  });

  fastify.route({
    method: "PUT",
    url: "/:id",
    schema: updateEntitySchema,
    preHandler: [fastify.authenticate],
    handler: async (request: FastifyRequest) => {
      const { id } = request.params as { id: string };
      const { body } = request;

      return await fastify.entityService.updateEntity(id, body);
    },
  });
};

export default entity;
