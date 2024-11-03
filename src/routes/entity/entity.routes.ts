import { FastifyRequest } from "fastify";
import { createEntitySchema } from "./schema/createEntitiySchema";
import { getEntitySchema } from "./schema/getEntitySchema";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

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
};

export default entity;
