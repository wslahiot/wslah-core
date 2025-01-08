import { Static, Type } from "@sinclair/typebox";

const IResponse = Type.Object({
  status: Type.String(),
  message: Type.String(),
});

export const IBody = Type.Object({
  type: Type.String(),
  payload: Type.Record(Type.String(), Type.Any()),
});

export type TBody = Static<typeof IBody>;
export type TResponse = Static<typeof IResponse>;

const IError = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});

export const createExternalConnectionSchema = {
  tags: ["External Connections"],
  deprecated: false,
  summary: "Create external connection",
  description: "Create a new external connection",
  body: IBody,
  response: {
    200: IResponse,
    400: IError,
    500: IError,
  },
};
