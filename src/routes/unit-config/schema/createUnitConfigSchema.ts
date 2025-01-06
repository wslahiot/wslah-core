import { Static, Type } from "@sinclair/typebox";

const IResponse = Type.Object({
  message: Type.String(),
  status: Type.String(),
});

export const IBody = Type.Object({
  primaryColor: Type.String(),
  secondaryColor: Type.String(),
  backgroundColor: Type.String(),
  imagePath: Type.String(),
  isSelectable: Type.Boolean(),
  unitId: Type.String(),
  policies: Type.Array(Type.String()),
});

export type TBody = Static<typeof IBody>;
export type TResponse = Static<typeof IResponse>;

const IError = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});

export const createUnitConfigSchema = {
  tags: ["Unit Configuration"],
  deprecated: false,
  summary: "Create new unit configuration",
  description: "Create new unit configuration with styling and policies",
  body: IBody,
  response: {
    200: IResponse,
    400: IError,
    404: IError,
    500: IError,
  },
};
