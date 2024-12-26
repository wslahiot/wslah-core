import { Static, Type } from "@sinclair/typebox";
const IHeader = Type.Object({
  "x-custom-key": Type.Optional(Type.String()),
});
type THeader = Static<typeof IHeader>;

const IParams = Type.Object({});
export type TParams = Static<typeof IParams>;

const IResponse = Type.Object({
  insertedId: Type.String(),
  status: Type.String(),
});

export const IBody = Type.Object({
  companyId: Type.String(),
  subscriptionModelId: Type.String(),
  startSubscription: Type.String(),
  endSubscription: Type.String(),
  user: Type.Optional(
    Type.Object({
      companyId: Type.String(),
    })
  ),
});

export type TBody = Static<typeof IBody>;

export type TResponse = Static<typeof IResponse>;

const IError = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});
type TError = Static<typeof IError>;

export type createSubscriptionType = {
  Header: THeader;
  Params: TParams;
  Response: TResponse;
  Error: TError;
};

export const createSubscriptionsSchema = {
  tags: ["Subscriptions"],
  deprecated: false,
  summary: "create subscription",
  description: "create subscription",
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
