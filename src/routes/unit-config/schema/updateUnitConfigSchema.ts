import { Static, Type } from "@sinclair/typebox";

const IParams = Type.Object({
  id: Type.String(),
});

const IBody = Type.Object({
  name: Type.Optional(Type.String()),
  primaryColor: Type.Optional(Type.String()),
  secondaryColor: Type.Optional(Type.String()),
  backgroundColor: Type.Optional(Type.String()),
  imagePath: Type.Optional(Type.String()),
  isSelectable: Type.Optional(Type.Boolean()),
  unitId: Type.Optional(Type.String()),
  policies: Type.Optional(Type.Array(Type.String())),
});

const IResponse = Type.Object({
  status: Type.String(),
  message: Type.String(),
});

export type TParams = Static<typeof IParams>;
export type TBody = Static<typeof IBody>;
export type TResponse = Static<typeof IResponse>;

const IError = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});

export const updateUnitConfigSchema = {
  tags: ["Unit Configuration"],
  deprecated: false,
  summary: "Update unit configuration",
  description: "Update an existing unit configuration by ID",
  params: IParams,
  body: IBody,
  response: {
    200: IResponse,
    400: IError,
    404: IError,
    500: IError,
  },
}; 