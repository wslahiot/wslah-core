import { Static, Type } from "@sinclair/typebox";

const IParams = Type.Object({
  id: Type.String(),
});
export type TParams = Static<typeof IParams>;

const IResponse = Type.Object({
  status: Type.String(),
  message: Type.String(),
});

export type TResponse = Static<typeof IResponse>;

const IError = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});

export const deleteReservationSchema = {
  tags: ["Reservations"],
  deprecated: false,
  summary: "Delete reservation",
  description: "Soft delete a reservation by ID",
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
