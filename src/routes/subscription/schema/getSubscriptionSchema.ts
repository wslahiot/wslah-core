import { Static, Type } from "@sinclair/typebox";

const IResponse = Type.Array(
  Type.Object({
    id: Type.String(),
    companyId: Type.String(),
    subscriptionModelId: Type.String(),
    startSubscription: Type.String(),
    endSubscription: Type.String(),
    status: Type.String(),
    isActive: Type.Boolean(),
    createdAt: Type.String(),
    updatedAt: Type.String(),
  })
);

export type TResponse = Static<typeof IResponse>;

const IError = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});

export const getSubscriptionSchema = {
  tags: ["Subscriptions"],
  deprecated: false,
  summary: "Get subscriptions",
  description: "Get all subscriptions for a company",
  response: {
    200: IResponse,
    400: IError,
    404: IError,
    500: IError,
  },
};

import fp from "fastify-plugin";
export default fp(async (fastify) => {});
