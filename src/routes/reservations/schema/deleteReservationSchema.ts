import { Type, Static } from "@sinclair/typebox";

export const IParams = Type.Object({
  id: Type.String(),
});

export const IResponse = Type.Object({
  status: Type.String(),
  message: Type.String(),
});

export const deleteReservationSchema = {
  params: IParams,
  response: {
    200: IResponse,
  },
};

export type TParams = Static<typeof IParams>;
export type TResponse = Static<typeof IResponse>;
