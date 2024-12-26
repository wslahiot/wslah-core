import { Static, Type } from "@sinclair/typebox";

const IParams = Type.Object({
  id: Type.String(),
});
export type TParams = Static<typeof IParams>;

const IResponse = Type.Object({
  status: Type.String(),
  message: Type.String(),
});

export const IBody = Type.Object({
  startDate: Type.Optional(Type.String()),
  endDate: Type.Optional(Type.String()),
  status: Type.Optional(Type.String()),
  notes: Type.Optional(Type.String()),
  price: Type.Optional(Type.Number()),
});

export type TBody = Static<typeof IBody>;
export type TResponse = Static<typeof IResponse>;

const IError = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});

export const updateReservationSchema = {
  tags: ["Reservations"],
  deprecated: false,
  summary: "Update reservation",
  description: "Update an existing reservation",
  params: IParams,
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
