import { Static, Type } from "@sinclair/typebox";

const IParams = Type.Object({
  id: Type.String(),
});

const IResponse = Type.Object({
  status: Type.String(),
  message: Type.String(),
});

export type TParams = Static<typeof IParams>;
export type TResponse = Static<typeof IResponse>;

const IError = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});

export const deleteExternalConnectionSchema = {
  tags: ["External Connections"],
  deprecated: false,
  summary: "Delete external connection",
  description: "Delete an external connection by its ID",
  params: IParams,
  response: {
    200: IResponse,
    400: IError,
    404: IError,
    500: IError,
  },
};
