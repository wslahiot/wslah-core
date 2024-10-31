import { Static, Type } from "@sinclair/typebox";

//? This is for unlock service schema
const IHeader = Type.Object({
  "x-custom-key": Type.Optional(Type.String()),
});
type THeader = Static<typeof IHeader>;

const IParams = Type.Object({});
type TParams = Static<typeof IParams>;

const IResponse = Type.Object({
  message: Type.String(),
  status: Type.Number(),
});
export const IBody = Type.Object({
  id: Type.String(),
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

export type unlockSchemaType = {
  Response: TBody;
};

export const unlockTtlockSchema = {
  tags: ["TTLock"],
  deprecated: false,
  summary: "unlock lock",
  description: "unlock lock",
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