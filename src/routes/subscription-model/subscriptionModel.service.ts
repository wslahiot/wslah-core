import fp from "fastify-plugin";

import { TResponse as GetUserSchemaBody } from "./schema/getSubscriptionModelInfoModelSchema";
import {
  TBody as BodySchema,
  createSubscriptionType,
} from "./schema/createSubscriptionModelSchema";

import { v4 } from "uuid";

export default fp(async (fastify) => {
  const getSubscriptionModels = async () => {
    const result = await fastify.mongo
      .collection("subscriptionModel")
      .find()
      .toArray();

    return result;
  };

  const createSubscriptionModel = async (body: BodySchema) => {
    if (!body) {
      return "No body";
    }

    const foundSubscriptionModel = await fastify.mongo
      .collection("subscriptionModel")
      .findOne({
        id: body.subscriptionId,
      });

    if (!foundSubscriptionModel) {
      return "No subscription model found";
    }

    try {
      fastify.mongo.collection("subscriptionModel").insertOne({
        ...body,
        id: v4(),
      });

      return { status: "success", message: "inserted successfully" };
    } catch (error: any) {
      console.error("Failed to insert subscription model:", error);
      return {
        message: "Failed to insert subscription model: " + error.message,
      };
    }
  };

  // Decorate the fastify instance with the departmentService
  // @ts-ignore
  fastify.decorate("subscriptionModelService", {
    getSubscriptionModels,
    createSubscriptionModel,
  });
});

declare module "fastify" {
  interface FastifyInstance {
    subscriptionModelService: {
      getSubscriptionModels: () => Promise<GetUserSchemaBody | null>;
      createSubscriptionModel: (
        body: BodySchema
      ) => Promise<createSubscriptionType | null>;
    };
  }
}
