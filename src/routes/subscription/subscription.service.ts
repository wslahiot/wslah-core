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
          // Convert subscriptionModelId to ObjectId
          $addFields: {
            subscriptionModelId: { $toObjectId: "$subscriptionModelId" },
          },
        },
        {
          $lookup: {
            from: "subscriptionModel",
            localField: "subscriptionModelId",
            foreignField: "_id",
            as: "subscriptionModelDetails",
          },
        },
        // Uncomment if each subscription has only one model:
        // { $unwind: "$subscriptionModelDetails" },
      ])

      // .find()
      .toArray();

    return result;
  };

  const createSubscription = async (body: BodySchema) => {
    const { user, ...rest } = body;

    if (!user) {
      return "No user found";
    }

    // Find the subscription model
    const foundSubscriptionModel = await fastify.mongo
      .collection("subscriptionModel")
      .findOne({
        _id: new ObjectId(body.subscriptionModelId),
      });

    if (!foundSubscriptionModel) {
      return "No subscription model found";
    }

    // Prepare the payload with unique id and other fields
    const payload = {
      id: new ObjectId().toString(), // Ensure id is unique
      ...rest,
      pricePerMonth:
        parseInt(foundSubscriptionModel.pricePerUnit) *
          parseInt(foundSubscriptionModel.pricePerUnit) || 0,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    try {
      const result = await fastify.mongo
        .collection("subscriptions")
        .insertOne(payload);
      return result;
    } catch (error) {
      console.error("Error creating subscription:", error);
      throw new Error("Failed to create subscription");
    }
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
