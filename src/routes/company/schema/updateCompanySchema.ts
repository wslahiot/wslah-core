import { Static, Type } from "@sinclair/typebox";

const IHeader = Type.Object({
  "x-custom-key": Type.Optional(Type.String()),
});
type THeader = Static<typeof IHeader>;

const IParams = Type.Object({
  id: Type.String(),
});
type TParams = Static<typeof IParams>;

const IResponse = Type.Object({
  message: Type.String(),
});

export const IBody = Type.Object({
  name: Type.Optional(Type.String()),
  region: Type.Optional(Type.String()),
  logo: Type.Optional(Type.String()),
  address: Type.Optional(Type.String()),
  phoneNumber: Type.Optional(Type.String()),
  email: Type.Optional(Type.String()),
});

export type TBody = Static<typeof IBody>;

export type TResponse = Static<typeof IResponse>;

const IError = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});
type TError = Static<typeof IError>;

export type updateCompanyType = {
  Header: THeader;
  Params: TParams;
  Response: TResponse;
  Error: TError;
};

export const updateCompanySchema = {
  tags: ["Company"],
  deprecated: false,
  summary: "Update company",
  description: "Update company",
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
