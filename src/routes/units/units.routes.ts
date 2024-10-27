import { FastifyRequest } from "fastify";
import { createUnitSchema } from "./schema/createUnitSchema";
import { getUnitsSchema } from "./schema/getUnitsSchema";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

const entity: FastifyPluginAsyncTypebox = async (
  fastify: any
): Promise<void> => {
  // api to get specific user
  fastify.route({
    method: "GET",
    url: "/",
    schema: getUnitsSchema,
    // preHandler: [fastify.authenticate],
    handler: async () => {
      return await fastify.unitsService.getEntities();
    },
  });

  fastify.route({
    method: "POST",
    url: "/",
    schema: createUnitSchema,
    // preHandler: [fastify.authenticate],
    handler: async (request: FastifyRequest) => {
      const { body } = request;
      return await fastify.unitsService.createEntity(body);
    },
  });
};

export default entity;
