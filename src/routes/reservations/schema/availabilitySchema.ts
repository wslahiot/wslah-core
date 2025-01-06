import { Type, Static } from "@sinclair/typebox";

export const IParams = Type.Object({
  unitId: Type.String(),
  date: Type.String(),
});

export const IResponse = Type.Object({
  date: Type.String(),
  availableHours: Type.Array(Type.String()),
  bookedHours: Type.Array(Type.String()),
});

export const availabilitySchema = {
  params: IParams,
  response: {
    200: IResponse,
  },
};

export type TParams = Static<typeof IParams>;
export type TResponse = Static<typeof IResponse>;
