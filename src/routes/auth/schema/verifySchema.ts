import { Static, Type } from "@sinclair/typebox";

const IHeaders = Type.Object({
  authorization: Type.String(),
});

export type THeaders = Static<typeof IHeaders>;

const IResponse = Type.String();

export type TResponse = Static<typeof IResponse>;

export const verifySchema = {
  tags: ["Auth"],
  headers: IHeaders,
  response: {
    200: IResponse,
    401: Type.Object({
      message: Type.String(),
    }),
    500: Type.Object({
      message: Type.String(),
    }),
  },
};
