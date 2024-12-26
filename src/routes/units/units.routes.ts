import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { createUnitSchema } from "./schema/createUnitSchema";
import { getUnitsSchema, getUnitByIdSchema } from "./schema/getUnitsSchema";
import { updateUnitSchema } from "./schema/updateUnitSchema";
import { deleteUnitSchema } from "./schema/deleteUnitSchema";

const units: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
  fastify.route({
    method: "GET",
    url: "/",
    schema: getUnitsSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: any) => {
      const decoded = fastify.decode(request.headers.authorization);
      return await fastify.unitsService.getUnits(decoded);
    },
  });

  fastify.route({
    method: "GET",
    url: "/:id",
    preHandler: [fastify.authenticate],
    schema: getUnitByIdSchema,
    handler: async (request: any) => {
      const { id } = request.params as { id: string };
      const decoded = fastify.decode(request.headers.authorization);
      return await fastify.unitsService.getUnitById(decoded, id);
    },
  });

  fastify.route({
    method: "POST",
    url: "/",
    preHandler: [fastify.authenticate],
    schema: createUnitSchema,
    handler: async (request: any) => {
      const { body } = request;
      const decoded = fastify.decode(request.headers.authorization);
      return await fastify.unitsService.createUnit(decoded, body);
    },
  });

  fastify.route({
    method: "PUT",
    url: "/:id",
    preHandler: [fastify.authenticate],
    schema: updateUnitSchema,
    handler: async (request: any) => {
      const { id } = request.params as { id: string };
      const { body } = request;
      const decoded = fastify.decode(request.headers.authorization);
      return await fastify.unitsService.updateUnit(decoded, id, body);
    },
  });

  fastify.route({
    method: "DELETE",
    url: "/:id",
    preHandler: [fastify.authenticate],
    schema: deleteUnitSchema,
    handler: async (request: any) => {
      const { id } = request.params as { id: string };
      const decoded = fastify.decode(request.headers.authorization);
      return await fastify.unitsService.deleteUnit(decoded, id);
    },
  });
};

export default units;
