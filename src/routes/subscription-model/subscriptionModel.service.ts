import fp from "fastify-plugin";

import { TResponse as GetUserSchemaBody } from "./schema/getSubscriptionModelInfoModelSchema";
import {
  TBody as BodySchema,
  createSubscriptionType,
} from "./schema/createSubscriptionModelSchema";
import { ObjectId } from "mongodb";

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
        _id: new ObjectId(body.subscriptionId),
      });

    if (!foundSubscriptionModel) {
      return "No subscription model found";
    }
    console.log({ foundSubscriptionModel });

    return;
    const result = fastify.mongo.collection("subscriptionModel").insertOne({
      ...body,
    });

    return result;
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
