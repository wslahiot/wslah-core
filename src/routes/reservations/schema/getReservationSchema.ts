import { Type, Static } from "@sinclair/typebox";

export const IParams = Type.Object({
  id: Type.String(),
});

export const IResponse = Type.Object({
  id: Type.String(),
  unitId: Type.String(),
  customerInfo: Type.Object({
    name: Type.String(),
    phone: Type.Optional(Type.String()),
  }),
  reservationDate: Type.String(),
  reservedHours: Type.Array(Type.Number()),
  createdAt: Type.String(),
  updatedAt: Type.String(),
});

export const getReservationSchema = {
  params: IParams,
  response: {
    200: IResponse,
  },
};

export type TParams = Static<typeof IParams>;
export type TResponse = Static<typeof IResponse>;
