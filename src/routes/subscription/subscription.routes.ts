import { createSubscriptionsSchema } from "./schema/createSubscriptionSchema";
import {
  getSubscriptionByIdSchema,
  getSubscriptionSchema,
} from "./schema/getSubscriptionInfoSchema";

const users = async (fastify: any): Promise<void> => {
  // api to get specific user
  fastify.route({
    method: "GET",
    url: "/",
    schema: getSubscriptionSchema,
    // preHandler: [fastify.authenticate],
    handler: async (request: any) => {
      const decoded = fastify.decode(request.headers.authorization);
      return await fastify.subscriptionService.getSubscriptions(decoded);
    },
  });
  // Create a new user
  fastify.route({
    method: "POST",
    url: "/",
    schema: createSubscriptionsSchema,
    // preHandler: [fastify.authenticate],
    handler: async (request: any) => {
      const data = request.body;
      const decoded = fastify.decode(request.headers.authorization);

      return await fastify.subscriptionService.createSubscription(
        decoded,
        data
      );
    },
  });
  //Example of a route

  fastify.route({
    method: "GET",
    url: "/:id",
    schema: getSubscriptionByIdSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: any) => {
      1;
      const id = request.params.id;
      const user = request.user;
      return await fastify.reportService.getReport(id, user.id);
    },
  });
};

export default users;
