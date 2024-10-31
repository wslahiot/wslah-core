import { Static, Type } from "@sinclair/typebox";

// const IHeader = Type.Object({
//   "x-custom-key": Type.Optional(Type.String()),
// });
// type THeader = Static<typeof IHeader>;

// const IParams = Type.Object({});
// type TParams = Static<typeof IParams>;

const IResponse = Type.Array(
  Type.Object({
    id: Type.String(),
    entityId: Type.String(),
    unitName: Type.String(),
    unitType: Type.String(),
    isPublic: Type.Boolean(),
    updatedAt: Type.String(),
    createdAt: Type.String(),
  })
);

export type TResponse = Static<typeof IResponse>;

const IError = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});

export const getUnitsSchema = {
  tags: ["Units"],
  deprecated: false,
  summary: "Get units info",
  description: "Get units info",
  response: {
    200: IResponse,
    400: IError,
    404: IError,
    500: IError,
  },
};

import fp from "fastify-plugin";

export default fp(async (fastify) => {});