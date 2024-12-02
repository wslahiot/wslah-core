import { FastifyRequest } from "fastify";
import { lockTtlockSchema } from "./schema/lockSchema";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import createPasscode, { createPasscodeSchema } from "./schema/createPasscode";
// import { createPasscodeSchema } from "./schema/createPasscode";

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
    schema: lockTtlockSchema,
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
    method: "GET",
    url: "/getOpenState/:lockId",

    preHandler: [fastify.authenticate],
    handler: async (request: FastifyRequest) => {
      const { lockId } = request.params as { lockId: string };

      return await fastify.ttlockService.getOpenState(lockId);
    },
  });
  fastify.route({
    method: "GET",
    url: "/getPasscodes/:lockId",

    preHandler: [fastify.authenticate],
    handler: async (request: FastifyRequest) => {
      const { lockId } = request.params as { lockId: string };
      console.log({ lockId });
      return await fastify.ttlockService.getPasscodes(lockId);
    },
  });

  fastify.route({
    method: "POST",
    url: "/generatePasscode",
    schema: createPasscodeSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: FastifyRequest) => {
      const { body } = request;
      return await fastify.ttlockService.generatePasscode(body);
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
