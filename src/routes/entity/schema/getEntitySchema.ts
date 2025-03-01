import { Static, Type } from "@sinclair/typebox";

// const IHeader = Type.Object({
//   "x-custom-key": Type.Optional(Type.String()),
// });
// type THeader = Static<typeof IHeader>;

// const IParams = Type.Object({});
// export type TParams = Static<typeof IParams>;

const IResponse = Type.Array(
  Type.Object({
    id: Type.String(),
    companyId: Type.String(),
    name: Type.String(),
    lat: Type.Number(),
    lng: Type.Number(),
    description: Type.String(),
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

export const getEntitySchema = {
  tags: ["Entity"],
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
