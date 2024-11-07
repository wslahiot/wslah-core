import { FastifyRequest } from "fastify";
import { createUnitSchema } from "./schema/createUnitSchema";
import {
  getUnitsByEntityIdSchema,
  getUnitsSchema,
} from "./schema/getUnitsSchema";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { getUnitsByIdSchema } from "./schema/getUnitByIdSchema";

const entity: FastifyPluginAsyncTypebox = async (
  fastify: any
): Promise<void> => {
  // api to get specific user
  fastify.route({
    method: "GET",
    url: "/",
    schema: getUnitsSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: FastifyRequest) => {
      const decoded = fastify.decode(request.headers.authorization);
      return await fastify.unitsService.getUnits(decoded);
    },
  });

  fastify.route({
    method: "GET",
    url: "/entity/:id",
    schema: getUnitsByEntityIdSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: any) => {
      const { id } = request.params;
      return await fastify.unitsService.getUnitsByEntityId(id);
    },
  });

  fastify.route({
    method: "GET",
    url: "/:id",
    schema: getUnitsByIdSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: any) => {
      const { id } = request.params;
      return await fastify.unitsService.getUnitById(id);
    },
  });

  fastify.route({
    method: "POST",
    url: "/",
    schema: createUnitSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: FastifyRequest) => {
      const { body } = request;
      const decoded = fastify.decode(request.headers.authorization);
      return await fastify.unitsService.createUnit(decoded, body);
    },
  });
};

export default entity;
