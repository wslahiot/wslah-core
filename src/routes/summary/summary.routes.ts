import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { getSummarySchema } from "./schema/getSummarySchema";

const summary: FastifyPluginAsyncTypebox = async (
  fastify: any
): Promise<void> => {
  fastify.route({
    method: "GET",
    url: "/",
    schema: getSummarySchema,
    preHandler: [fastify.authenticate],
    handler: async (request: any) => {
      const decoded = fastify.decode(request.headers.authorization);
      console.log({ decoded, user: request.user });
      return await fastify.summaryService.getSummary(decoded);
    },
  });
};

export default summary;
