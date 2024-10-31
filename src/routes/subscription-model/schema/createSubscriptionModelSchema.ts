import { Static, Type } from "@sinclair/typebox";
const IHeader = Type.Object({
  "x-custom-key": Type.Optional(Type.String()),
});
type THeader = Static<typeof IHeader>;

const IParams = Type.Object({});
type TParams = Static<typeof IParams>;

const IResponse = Type.Object({
  insertedId: Type.String(),
});

export const IBody = Type.Object({
  subscriptionId: Type.Optional(Type.String()),
  description: Type.String(),
  pricePerUnit: Type.String(),
  name: Type.String(),
  maxUnits: Type.Number(),
  minUnits: Type.Number(),
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

export const createSubscriptionModelSchema = {
  tags: ["Subscription Model"],
  deprecated: false,
  summary: "create subscription model",
  description: "create subscription model",
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
