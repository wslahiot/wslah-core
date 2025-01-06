import { Type, Static } from "@sinclair/typebox";

export const IResponse = Type.Array(
  Type.Object({
    id: Type.String(),
    unitId: Type.String(),
    customerInfo: Type.Object({
      name: Type.String(),
      phone: Type.Optional(Type.String()),
    }),
    reservationDate: Type.String(),
    reservedHours: Type.Array(Type.Number()),
    notes: Type.Optional(Type.String()),
    price: Type.Number(),
    isActive: Type.Boolean(),
    createdAt: Type.String(),
    updatedAt: Type.String(),
  })
);

export const getReservationsSchema = {
  response: {
    200: IResponse,
  },
};

export type TResponse = Static<typeof IResponse>;
