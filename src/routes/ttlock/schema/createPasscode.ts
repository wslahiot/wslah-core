import { Static, Type } from "@sinclair/typebox";

// const IHeader = Type.Object({
//   "x-custom-key": Type.Optional(Type.String()),
// });
// type THeader = Static<typeof IHeader>;

export const IBody = Type.Object({
  lockId: Type.String(),
  passcode: Type.String(),
  passcodeName: Type.String(),
  startDate: Type.Optional(Type.String()),
  endDate: Type.Optional(Type.String()),
});

// export type TParams = Static<typeof IParams>;

const IResponse = Type.Object({
  message: Type.String(),
  status: Type.String(),
});

export type TResponse = Static<typeof IResponse>;

export type TBody = Static<typeof IBody>;

const IError = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});

export const createPasscodeSchema = {
  tags: ["TTLock"],
  deprecated: false,
  summary: "Get devices info",
  description: "Get devices info",
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
