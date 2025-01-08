import { Static, Type } from "@sinclair/typebox";

const IParams = Type.Object({
  id: Type.String(),
});

const IResponse = Type.Object({
  id: Type.String(),
  companyId: Type.String(),
  type: Type.String(),
  payload: Type.Record(Type.String(), Type.Any()),
  createdAt: Type.String(),
  updatedAt: Type.String(),
});

export type TParams = Static<typeof IParams>;
export type TResponse = Static<typeof IResponse>;

const IError = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});

export const getExternalConnectionByIdSchema = {
  tags: ["External Connections"],
  deprecated: false,
  summary: "Get external connection by ID",
  description: "Retrieve a specific external connection by its ID",
  params: IParams,
  response: {
    200: IResponse,
    400: IError,
    404: IError,
    500: IError,
  },
};
