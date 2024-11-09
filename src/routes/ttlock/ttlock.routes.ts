import { FastifyRequest } from "fastify";
import { lockTtlockSchema } from "./schema/lockSchema";
import { getDeviceSchema } from "./schema/getDeviceSchema";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

type lockBody = {
  id: string;
};

const Ttlock: FastifyPluginAsyncTypebox = async (
  fastify: any
): Promise<void> => {
  // api to get specific user
  fastify.route({
    method: "POST",
    url: "/unlock",
    schema: getDeviceSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: FastifyRequest) => {
      const { id } = request.body as lockBody;
      return await fastify.ttlockService.unlock(id);
    },
  });

  fastify.route({
    method: "POST",
    url: "/sync",
    schema: lockTtlockSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: FastifyRequest) => {
      const { id } = request.body as lockBody;
      return await fastify.ttlockService.sync(id);
    },
  });

  fastify.route({
    method: "POST",
    url: "/lock",
    schema: lockTtlockSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: FastifyRequest) => {
      const { id } = request.body as lockBody;

      return await fastify.ttlockService.lock(id);
    },
  });
};

export default Ttlock;
