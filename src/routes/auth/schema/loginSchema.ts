// src/routes/auth/schema/loginSchema.ts
import { Static, Type } from "@sinclair/typebox";

export const IBody = Type.Object({
  phone: Type.String({ minLength: 3 }),
  password: Type.String({ minLength: 6 }),
});

export type TBody = Static<typeof IBody>;

const IResponse = Type.Object({
  token: Type.String(),
  userId: Type.String(),
  userInfo: Type.Object({
    name: Type.String(),
    email: Type.String(),
    id: Type.String(),
    companyId: Type.String(),
  }),
});

export type TResponse = Static<typeof IResponse>;

export const loginSchema = {
  tags: ["Auth"],
  body: IBody,
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
