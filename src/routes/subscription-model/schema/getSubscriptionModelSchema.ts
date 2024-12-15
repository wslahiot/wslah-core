import { Static, Type } from "@sinclair/typebox";

const IResponse = Type.Array(
  Type.Object({
    id: Type.String(),
    subscriptionId: Type.Optional(Type.String()),
    name: Type.String(),
    description: Type.String(),
    pricePerUnit: Type.String(),
    maxUnits: Type.Number(),
    minUnits: Type.Number(),
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

export const getSubscriptionModelSchema = {
  tags: ["Subscription Model"],
  deprecated: false,
  summary: "Get subscription models",
  description: "Get all subscription models",
  response: {
    200: IResponse,
    400: IError,
    404: IError,
    500: IError,
  },
};

import fp from "fastify-plugin";
export default fp(async (fastify) => {});
