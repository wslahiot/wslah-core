import { Static, Type } from "@sinclair/typebox";

const IHeader = Type.Object({
  "x-custom-key": Type.Optional(Type.String()),
});
type THeader = Static<typeof IHeader>;

const IParams = Type.Object({});
export type TParams = Static<typeof IParams>;

const IResponse = Type.Object({
  id: Type.String(),
  status: Type.String(),
});

export const IBody = Type.Object({
  name: Type.String(),
  // imgSource: Type.Optional(Type.String()),
  lat: Type.Number(),
  lng: Type.Number(),
  description: Type.String(),
  linkedUnits: Type.Optional(Type.Array(Type.String())),
});

export type TBody = Static<typeof IBody>;

export type TResponse = Static<typeof IResponse>;

const IError = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});
type TError = Static<typeof IError>;

export type createEntityType = {
  Header: THeader;
  Params: TParams;
  Response: TResponse;
  Error: TError;
};

export const createEntitySchema = {
  tags: ["Entity"],
  deprecated: false,
  summary: "Get user info",
  description: "Get user info",
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
