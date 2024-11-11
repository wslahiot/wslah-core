import fp from "fastify-plugin";

import { TResponse as GetUserSchemaBody } from "./schema/getSubscriptionInfoSchema";
import {
  TBody as BodySchema,
  createSubscriptionType,
} from "./schema/createSubscriptionSchema";

import { decodeType } from "../../plugins/authenticate";
import { v4 } from "uuid";

export default fp(async (fastify) => {
  const getSubscriptions = async (userInfo: decodeType) => {
    const result = await fastify.mongo
      .collection("subscriptions")
      .aggregate([
        {
          $match: {
            companyId: userInfo.companyId,
          },
        },
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
            foreignField: "id",
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

  const createSubscription = async (userInfo: decodeType, body: BodySchema) => {
    // Find the subscription model
    const foundSubscriptionModel = await fastify.mongo
      .collection("subscriptionModel")
      .findOne({
        id: body.subscriptionModelId,
      });

    if (!foundSubscriptionModel) {
      return "No subscription model found";
    }

    // Prepare the payload with unique id and other fields
    const payload = {
      ...body,
      id: v4(),
      companyId: userInfo.companyId,
      pricePerMonth:
        parseInt(foundSubscriptionModel.pricePerUnit) *
          parseInt(foundSubscriptionModel.pricePerUnit) || 0,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    try {
      await fastify.mongo.collection("subscriptions").insertOne(payload);
      return { status: "success", message: "inserted successfully" };
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      return { message: "Failed to create subscription: " + error.message };
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
      getSubscriptions: (
        userInfo: decodeType
      ) => Promise<GetUserSchemaBody | null>;
      createSubscription: (
        userInfo: decodeType,
        body: BodySchema
      ) => Promise<createSubscriptionType | null>;
    };
  }
}
