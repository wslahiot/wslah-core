import { Static, Type } from "@sinclair/typebox";

export const IBody = Type.Object({
  name: Type.String({ minLength: 2 }),
  email: Type.String({ format: "email" }),
  address: Type.String(),
  phone: Type.String({ minLength: 3 }),
});

export type TBody = Static<typeof IBody>;

const IResponse = Type.Object({
  status: Type.String(),
  companyId: Type.String(),
});

export type TResponse = Static<typeof IResponse>;

export const signupCompanySchema = {
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
