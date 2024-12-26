import { Static, Type } from "@sinclair/typebox";

const IParams = Type.Object({
  id: Type.String(),
});
export type TParams = Static<typeof IParams>;

const IResponse = Type.Object({
  status: Type.String(),
  message: Type.String(),
});

export const IBody = Type.Object({
  name: Type.Optional(Type.String()),
  description: Type.Optional(Type.String()),
  pricePerUnit: Type.Optional(Type.String()),
  maxUnits: Type.Optional(Type.Number()),
  minUnits: Type.Optional(Type.Number()),
});

export type TBody = Static<typeof IBody>;
export type TResponse = Static<typeof IResponse>;

const IError = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});

export const updateSubscriptionModelSchema = {
  tags: ["Subscription Model"],
  deprecated: false,
  summary: "Update subscription model",
  description: "Update an existing subscription model",
  params: IParams,
  body: IBody,
  response: {
    200: IResponse,
    400: IError,
    404: IError,
    500: IError,
  },
};

import fp from "fastify-plugin";
export default fp(async (fastify) => {});
