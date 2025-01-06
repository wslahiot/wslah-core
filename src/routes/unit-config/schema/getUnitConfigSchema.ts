import { Static, Type } from "@sinclair/typebox";

const IUnitConfig = Type.Object({
  id: Type.Optional(Type.String()),
  name: Type.String(),
  primaryColor: Type.String(),
  secondaryColor: Type.String(),
  backgroundColor: Type.String(),
  imagePath: Type.String(),
  isSelectable: Type.Boolean(),
  unitId: Type.String(),
  policies: Type.Array(Type.String()),
  companyId: Type.String(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
  createdBy: Type.String(),
  updatedBy: Type.String(),
});

export type TResponse = Static<typeof IUnitConfig>;

const IError = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});

export const getUnitConfigSchema = {
  tags: ["Unit Configuration"],
  deprecated: false,
  summary: "Get all unit configurations",
  description: "Retrieve all unit configurations for the company",
  response: {
    200: Type.Array(IUnitConfig),
    400: IError,
    404: IError,
    500: IError,
  },
};
