import { Static, Type } from "@sinclair/typebox";

const IHeader = Type.Object({
  "x-custom-key": Type.Optional(Type.String()),
});
type THeader = Static<typeof IHeader>;

const IParams = Type.Object({
  id: Type.String(),
});
export type TParams = Static<typeof IParams>;

const IResponse = Type.Object({
  id: Type.String(),
});

export const IBody = Type.Object(
  {
    name: Type.Optional(Type.String()),
    lat: Type.Optional(Type.Number()),
    lng: Type.Optional(Type.Number()),
    description: Type.Optional(Type.String()),
  },
  { additionalProperties: false } // Enforces that no extra keys are allowed
);

export type TBody = Static<typeof IBody>;

export type TResponse = Static<typeof IResponse>;

const IError = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});
type TError = Static<typeof IError>;

export type updateEntityType = {
  Header: THeader;
  Params: TParams;
  Response: TResponse;
  Error: TError;
};

export const updateEntitySchema = {
  tags: ["Entity"],
  deprecated: false,
  summary: "Get user info",
  description: "Get user info",
  body: IBody,
  params: IParams,
  response: {
    200: IResponse,
    400: IError,
    404: IError,
    500: IError,
  },
};

import fp from "fastify-plugin";

export default fp(async (fastify) => {});
