import { Static, Type } from "@sinclair/typebox";

const IHeader = Type.Object({
  "x-custom-key": Type.Optional(Type.String()),
});
type THeader = Static<typeof IHeader>;

const IParams = Type.Object({});
export type TParams = Static<typeof IParams>;

const IResponse = Type.Array(
  Type.Object({
    id: Type.String(),
    companyId: Type.String(),
    username: Type.String(),
    password: Type.String(),
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
type TError = Static<typeof IError>;

export type getUserInfoSchemaType = {
  Header: THeader;
  Params: TParams;
  Response: TResponse;
  Error: TError;
};

export const getUserByIdSchema = {
  tags: ["Users"],
  deprecated: false,
  summary: "Get user by id info",
  description: "Get user by id info",
  // headers: IHeader,
  params: IParams,
  response: {
    200: IResponse,
    400: IError,
    404: IError,
    500: IError,
  },
};

export const getUserSchema = {
  tags: ["Users"],
  deprecated: false,
  summary: "Get user info",
  description: "Get user info",
  headers: IHeader,

  response: {
    200: IResponse,
    400: IError,
    404: IError,
    500: IError,
  },
};

import fp from "fastify-plugin";

export default fp(async (fastify) => {});
