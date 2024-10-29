import { createSubscriptionModelSchema } from "./schema/createSubscriptionModelSchema";
import {
  getSubscriptionModelByIdSchema,
  getSubscriptionModelSchema,
} from "./schema/getSubscriptionModelInfoModelSchema";

const users = async (fastify: any): Promise<void> => {
  // api to get specific user
  fastify.route({
    method: "GET",
    url: "/",
    schema: getSubscriptionModelSchema,
    preHandler: [fastify.authenticate],
    handler: async () => {
      return await fastify.subscriptionModelService.getSubscriptionModels();
    },
  });

  // Create a new user
  fastify.route({
    method: "POST",
    url: "/",
    schema: createSubscriptionModelSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: any) => {
      const data = request.body;
      return await fastify.subscriptionModelService.createSubscriptionModel(
        data
      );
    },
  });

  //Example of a route
  fastify.route({
    method: "GET",
    url: "/:id",
    schema: getSubscriptionModelByIdSchema,
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
