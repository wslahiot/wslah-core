import { Static, Type } from "@sinclair/typebox";

const IExternalConnection = Type.Object({
  id: Type.String(),
  companyId: Type.String(),
  type: Type.String(),
  payload: Type.Record(Type.String(), Type.Any()),
  createdAt: Type.String(),
  updatedAt: Type.String(),
});

export const IResponse = Type.Array(IExternalConnection);

export type TResponse = Static<typeof IResponse>;

const IError = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});

export const getExternalConnectionsSchema = {
  tags: ["External Connections"],
  deprecated: false,
  summary: "Get all external connections",
  description: "Retrieve all external connections for the company",
  response: {
    200: IResponse,
    400: IError,
    500: IError,
  },
};
