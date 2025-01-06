import { Static, Type } from "@sinclair/typebox";

const IParams = Type.Object({
  id: Type.String(),
});

const IUnitConfig = Type.Object({
  status: Type.String(),
  message: Type.String(),
  data: Type.Optional(
    Type.Object({
      id: Type.Optional(Type.String()),
      primaryColor: Type.Optional(Type.String()),
      secondaryColor: Type.Optional(Type.String()),
      backgroundColor: Type.Optional(Type.String()),
      imagePath: Type.Optional(Type.String()),
      isSelectable: Type.Optional(Type.Boolean()),
      unitId: Type.Optional(Type.String()),
      policies: Type.Optional(Type.Array(Type.String())),
      companyId: Type.Optional(Type.String()),
      createdAt: Type.Optional(Type.String()),
      updatedAt: Type.Optional(Type.String()),
    })
  ),
});

export type TParams = Static<typeof IParams>;
export type TResponse = Static<typeof IUnitConfig>;

const IError = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});

export const getUnitConfigByIdSchema = {
  tags: ["Unit Configuration"],
  deprecated: false,
  summary: "Get unit configuration by ID",
  description: "Retrieve a specific unit configuration by its ID",
  params: IParams,
  response: {
    200: IUnitConfig,
    400: IError,
    404: IError,
    500: IError,
  },
};
