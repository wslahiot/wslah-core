import { Static, Type } from "@sinclair/typebox";

export const IBody = Type.Object({
  userName: Type.String(),
  numbers: Type.String(),
  userSender: Type.String(),
  apiKey: Type.String(),
  msg: Type.String()
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

export const sendSmsSchema = {
  tags: ["Messages"],
  deprecated: false,
  summary: "Send SMS",
  description: "Send SMS using Msegat service",
  body: IBody,
  response: {
    200: IResponse,
    400: IError,
    500: IError,
  },
}; 