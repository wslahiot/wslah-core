import { Static, Type } from "@sinclair/typebox";

const IHeader = Type.Object({
  "x-custom-key": Type.Optional(Type.String()),
});
type THeader = Static<typeof IHeader>;

const IParams = Type.Object({});
export type TParams = Static<typeof IParams>;

const IResponse = Type.Object({
  status: Type.String(),
  message: Type.String(),
});

export const IBody = Type.Object({
  unitId: Type.String(),
  customerId: Type.String(),
  startDate: Type.String(),
  endDate: Type.String(),
  status: Type.String(),
  notes: Type.Optional(Type.String()),
  price: Type.Number(),
});

export type TBody = Static<typeof IBody>;
export type TResponse = Static<typeof IResponse>;

const IError = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});
type TError = Static<typeof IError>;

export type createReservationType = {
  Header: THeader;
  Params: TParams;
  Response: TResponse;
  Error: TError;
};

export const createReservationSchema = {
  tags: ["Reservations"],
  deprecated: false,
  summary: "Create new reservation",
  description: "Create a new reservation for a unit",
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