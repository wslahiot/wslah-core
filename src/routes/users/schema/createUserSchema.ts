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
  companyId: Type.String(),
  username: Type.String(),
  password: Type.String(),
  phone: Type.String(),
});

export type TBody = Static<typeof IBody>;

export type TResponse = Static<typeof IResponse>;

const IError = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});
type TError = Static<typeof IError>;

export type createUserType = {
  Header: THeader;
  Params: TParams;
  Response: TResponse;
  Error: TError;
};

export const createUsersSchema = {
  tags: ["Users"],
  deprecated: false,
  summary: "create user",
  description: "create user",
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
