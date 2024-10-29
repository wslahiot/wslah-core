import fp from "fastify-plugin";

import { TResponse as GetUserSchemaBody } from "./schema/getSubscriptionInfoSchema";
import {
  TBody as BodySchema,
  createSubscriptionType,
} from "./schema/createSubscriptionSchema";
import { ObjectId } from "mongodb";

export default fp(async (fastify) => {
  const getSubscriptions = async () => {
    const result = await fastify.mongo
      .collection("subscriptions")
      .aggregate([
        {
          $lookup: {
            from: "subscriptionModel", // The collection to join
            localField: "subscriptionModelId", // Field in the "subscriptions" collection
            foreignField: "_id", // Field in the "subscriptionModel" collection
            as: "subscriptionModelDetails", // Name for the joined data
          },
        },
        // {
        //   $unwind: "$subscriptionModelDetails", // Optional: if each subscription has only one model
        // },
      ])

      // .find()
      .toArray();

    console.log({ result });
    return result;
  };

  const createSubscription = async (body: BodySchema) => {
    const { user, ...rest } = body;

    if (!user) {
      return "No user found";
    }

    const foundSubscriptionModel = await fastify.mongo
      .collection("subscriptionModel")
      .findOne({
        _id: new ObjectId(body.subscriptionModelId),
      });

    console.log({ foundSubscriptionModel });
    if (!foundSubscriptionModel) {
      return "No subscription model found";
    }

    const payload = {
      // id: new ObjectId(),
      ...rest,
      price: foundSubscriptionModel.price,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    console.log({ payload });
    const result = await fastify.mongo
      .collection("subscriptions")
      .insertOne(payload);
    return result;
  };

  // Decorate the fastify instance with the departmentService
  // @ts-ignore
  fastify.decorate("subscriptionService", {
    getSubscriptions,
    createSubscription,
  });
});

declare module "fastify" {
  interface FastifyInstance {
    subscriptionService: {
      getSubscriptions: () => Promise<GetUserSchemaBody | null>;
      createSubscription: (
        user: BodySchema
      ) => Promise<createSubscriptionType | null>;
    };
  }
}
