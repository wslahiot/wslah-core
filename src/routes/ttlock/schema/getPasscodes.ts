import { Static, Type } from "@sinclair/typebox";

// const IHeader = Type.Object({
//   "x-custom-key": Type.Optional(Type.String()),
// });
// type THeader = Static<typeof IHeader>;

const IParams = Type.Object({
  id: Type.String(),
});
// export type TParams = Static<typeof IParams>;

const IResponse = Type.Array(
  Type.Object({
    passcode: Type.String(),
    passcodeName: Type.String(),
    startDate: Type.String(),
    endDate: Type.String(),
  })
);

export type TResponse = Static<typeof IResponse>;

const IError = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});

export const getDeviceSchema = {
  tags: ["TTLock"],
  deprecated: false,
  summary: "Get devices info",
  description: "Get devices info",
  IParams,
  response: {
    200: IResponse,
    400: IError,
    404: IError,
    500: IError,
  },
};

import fp from "fastify-plugin";

export default fp(async (fastify) => {});
