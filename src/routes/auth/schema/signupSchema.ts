import { Static, Type } from "@sinclair/typebox";

export const IBody = Type.Object({
  name: Type.String({ minLength: 2 }),
  email: Type.String({ format: "email" }),
  phone: Type.String({ minLength: 3 }),
  password: Type.String({ minLength: 6 }),
  companyId: Type.String(),
});

export type TBody = Static<typeof IBody>;

const IResponse = Type.Object({
  status: Type.String(),
  userId: Type.String(),
});

export type TResponse = Static<typeof IResponse>;

export const signupSchema = {
  tags: ["Auth"],
  body: IBody,
  response: {
    200: IResponse,
    400: Type.Object({
      message: Type.String(),
    }),
    500: Type.Object({
      message: Type.String(),
    }),
  },
};
