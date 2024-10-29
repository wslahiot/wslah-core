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
    handler: async () => {
      return await fastify.ttlockService.unlcok;
    },
  });

  fastify.route({
    method: "POST",
    url: "/lock",
    schema: lockTtlockSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: FastifyRequest) => {
      const { id } = request.body as lockBody;

      return await fastify.ttlockService.unlockLock(id);
    },
  });
};

export default Ttlock;
