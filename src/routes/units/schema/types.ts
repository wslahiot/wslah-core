import { Static, Type } from "@sinclair/typebox";

// Common Unit interface
export const UnitSchema = Type.Object({
  id: Type.String(),
  companyId: Type.String(),
  entityId: Type.Optional(Type.String()),
  name: Type.String(),
  isPublic: Type.Boolean({ default: false }),
  isActive: Type.Boolean({ default: true }),
  lastMaintenanceDate: Type.Optional(Type.String()),
  updatedAt: Type.String(),
  createdAt: Type.String(),
});

export type TUnit = Static<typeof UnitSchema>;

// Common Error response
export const ErrorSchema = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});
