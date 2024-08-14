import { Static, Type } from "@sinclair/typebox";

// const IHeader = Type.Object({
//   "x-custom-key": Type.Optional(Type.String()),
// });
// type THeader = Static<typeof IHeader>;

// const IParams = Type.Object({});
// type TParams = Static<typeof IParams>;

const IResponse = Type.Array(
  Type.Object({
    _id: Type.String(),
    name: Type.String(),
    region: Type.String(),
    logo: Type.String(),
    address: Type.String(),
    phoneNumber: Type.String(),
    email: Type.String(),
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
// type TError = Static<typeof IError>;

// export type getUserInfoSchemaType = {
//   Header: THeader;
//   Params: TParams;
//   Response: TResponse;
//   Error: TError;
// };

export const getCompanySchema = {
  tags: ["Company"],
  deprecated: false,
  summary: "Get user info",
  description: "Get user info",
  response: {
    200: IResponse,
    400: IError,
    404: IError,
    500: IError,
  },
};

import fp from "fastify-plugin";

export default fp(async (fastify) => {});
