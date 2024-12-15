import { Static, Type } from "@sinclair/typebox";

const IHeader = Type.Object({
  "x-custom-key": Type.Optional(Type.String()),
});
type THeader = Static<typeof IHeader>;

const IParams = Type.Object({
  id: Type.String(),
});
export type TParams = Static<typeof IParams>;

const IResponse = Type.Array(
  Type.Object(
    {
      id: Type.String(),
      companyId: Type.String(),
    },
    {
      additionalProperties: true,
    }
  )
);

export type TResponse = Static<typeof IResponse>;

const IError = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});
type TError = Static<typeof IError>;

export type getSubscriptionInfoSchemaType = {
  Header: THeader;
  Params: TParams;
  Response: TResponse;
  Error: TError;
};

export const getSubscriptionSchema = {
  tags: ["Subscriptions"],
  deprecated: false,
  summary: "Get subscription by id info",
  description: "Get subscription by id info",
  headers: IHeader,

  response: {
    200: IResponse,
    400: IError,
    404: IError,
    500: IError,
  },
};

export const getSubscriptionByIdSchema = {
  ...getSubscriptionSchema,
  params: IParams,
};

import fp from "fastify-plugin";

export default fp(async (fastify) => {});
