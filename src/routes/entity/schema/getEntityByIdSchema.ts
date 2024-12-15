import { Static, Type } from "@sinclair/typebox";

const IParams = Type.Object({
  id: Type.String(),
});
export type TParams = Static<typeof IParams>;

const IResponse = Type.Object({
  id: Type.String(),
  companyId: Type.String(),
  name: Type.String(),
  description: Type.String(),
  lat: Type.Number(),
  lng: Type.Number(),
  isActive: Type.Boolean(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
});

export type TResponse = Static<typeof IResponse>;

const IError = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});

export const getEntityByIdSchema = {
  tags: ["Entity"],
  deprecated: false,
  summary: "Get entity by ID",
  description: "Get specific entity details by ID",
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
