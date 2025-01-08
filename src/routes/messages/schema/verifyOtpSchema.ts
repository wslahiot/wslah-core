import { Static, Type } from "@sinclair/typebox";

export const IBody = Type.Object({
  userName: Type.String(),
  userSender: Type.String(),
  apiKey: Type.String(),
  lang: Type.String(),
  code: Type.String(),
  id: Type.Number()
});

export type TBody = Static<typeof IBody>;

const IResponse = Type.Object({
  status: Type.String(),
  data: Type.Object({
    code: Type.String(),
    message: Type.String(),
    id: Type.Number()
  })
});

const IError = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});

export const verifyOtpSchema = {
  tags: ["Messages"],
  deprecated: false,
  summary: "Verify OTP",
  description: "Verify OTP using Msegat service",
  body: IBody,
  response: {
    200: IResponse,
    400: IError,
    500: IError,
  },
}; 