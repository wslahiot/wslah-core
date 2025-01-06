import { Type, Static } from "@sinclair/typebox";

export const IParams = Type.Object({
  id: Type.String(),
});

export const IBody = Type.Object({
  customerInfo: Type.Optional(
    Type.Object({
      name: Type.Optional(Type.String()),
      phone: Type.Optional(Type.String()),
    })
  ),
  reservationDate: Type.Optional(Type.String()),
  reservedHours: Type.Optional(Type.Array(Type.Number())),
  notes: Type.Optional(Type.String()),
  price: Type.Optional(Type.Number()),
});

export const IResponse = Type.Object({
  status: Type.String(),
  message: Type.String(),
});

export const updateReservationSchema = {
  params: IParams,
  body: IBody,
  response: {
    200: IResponse,
  },
};

export type TParams = Static<typeof IParams>;
export type TBody = Static<typeof IBody>;
export type TResponse = Static<typeof IResponse>;
