import { Static, Type } from "@sinclair/typebox";

const IResponse = Type.Array(
  Type.Object({
    id: Type.String(),
    companyId: Type.String(),
    unitId: Type.String(),
    customerId: Type.String(),
    startDate: Type.String(),
    endDate: Type.String(),
    status: Type.String(),
    notes: Type.Optional(Type.String()),
    price: Type.Number(),
    isActive: Type.Boolean(),
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

export const getReservationsSchema = {
  tags: ["Reservations"],
  deprecated: false,
  summary: "Get reservations",
  description: "Get all reservations for a company",
  response: {
    200: IResponse,
    400: IError,
    404: IError,
    500: IError,
  },
};

import fp from "fastify-plugin";
export default fp(async (fastify) => {});
