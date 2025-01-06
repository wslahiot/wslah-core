import { Type, Static } from "@sinclair/typebox";

export const IBody = Type.Object({
  unitId: Type.String(),
  customerInfo: Type.Object({
    name: Type.String(),

    phone: Type.Optional(Type.String()),
  }),
  reservationDate: Type.String(), // YYYY-MM-DD
  reservedHours: Type.Array(Type.String()), // ["13:00", "14:00", "15:00"] for 1PM-4PM
});

export const IResponse = Type.Object(
  {},
  {
    additionalProperties: true,
  }
);

export const createReservationSchema = {
  body: IBody,
  response: {
    200: IResponse,
  },
};

export type TBody = Static<typeof IBody>;
export type TResponse = Static<typeof IResponse>;
