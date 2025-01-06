import { FastifyRequest } from "fastify";
import { createUnitConfigSchema } from "./schema/createUnitConfigSchema";
// import { getUnitConfigSchema } from "./schema/getUnitConfigSchema";
import { getUnitConfigByIdSchema } from "./schema/getUnitConfigByIdSchema";
import { updateUnitConfigSchema } from "./schema/updateUnitConfigSchema";

import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

const unitConfig: FastifyPluginAsyncTypebox = async (
  fastify: any
): Promise<void> => {
  // fastify.route({
  //   method: "GET",
  //   url: "/:unitId",
  //   schema: getUnitConfigSchema,
  //   // preHandler: [fastify.authenticate],
  //   handler: async (request: any) => {
  //     const decoded = fastify.decode(request.headers.authorization);
  //     const { unitId } = request.params;
  //     return await fastify.unitConfigService.getUnitConfigs(decoded, unitId);
  //   },
  // });

  fastify.route({
    method: "POST",
    url: "/",
    schema: createUnitConfigSchema,
    // preHandler: [fastify.authenticate],
    handler: async (request: FastifyRequest) => {
      const { body } = request;
      const decoded = fastify.decode(request.headers.authorization);
      return await fastify.unitConfigService.createUnitConfig(decoded, body);
    },
  });

  fastify.route({
    method: "GET",
    url: "/:id",
    schema: getUnitConfigByIdSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: FastifyRequest) => {
      const { id } = request.params as { id: string };

      return await fastify.unitConfigService.getUnitConfigById(id);
    },
  });

  fastify.route({
    method: "PUT",
    url: "/:id",
    schema: updateUnitConfigSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: FastifyRequest) => {
      const { id } = request.params as { id: string };
      const { body } = request;

      return await fastify.unitConfigService.updateUnitConfig(id, body);
    },
  });

  //   fastify.route({
  //     method: "DELETE",
  //     url: "/:id",
  //     schema: deleteUnitConfigSchema,
  // preHandler: [fastify.authenticate],
  //     handler: async (request: FastifyRequest) => {
  //       const { id } = request.params as { id: string };
  //       const decoded = fastify.decode(request.headers.authorization);
  //       return await fastify.unitConfigService.deleteUnitConfig(decoded, id);
  //     },
  //   });
};

export default unitConfig;
