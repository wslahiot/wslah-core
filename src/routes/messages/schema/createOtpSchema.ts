import { Static, Type } from "@sinclair/typebox";

export const IBody = Type.Object({
  userName: Type.String(),
  number: Type.String(),
  userSender: Type.String(),
  lang: Type.String(),
  apiKey: Type.String(),
});

export type TBody = Static<typeof IBody>;

const IResponse = Type.Object({}, { additionalProperties: true });

const IError = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});

export const createOtpSchema = {
  tags: ["Messages"],
  deprecated: false,
  summary: "Create OTP",
  description: "Create OTP using Msegat service",
  body: IBody,
  response: {
    200: IResponse,
    400: IError,
    500: IError,
  },
};
