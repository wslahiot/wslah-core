import { Static, Type } from "@sinclair/typebox";

// Base schema for common properties
const BaseSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  description: Type.Optional(Type.String()),
  isActive: Type.Boolean({ default: true }),
  createdAt: Type.String(),
  updatedAt: Type.String(),
});

// Core schemas
export const ActionSchema = Type.Intersect([
  BaseSchema,
  Type.Object({
    code: Type.String(),
    module: Type.String(),
  }),
]);

export const RoleSchema = Type.Intersect([
  BaseSchema,
  Type.Object({
    actions: Type.Array(Type.String()),
    companyId: Type.String(),
  }),
]);

export const GroupSchema = Type.Intersect([
  BaseSchema,
  Type.Object({
    roles: Type.Array(Type.String()),
    companyId: Type.String(),
  }),
]);

export const UserRolesSchema = Type.Object({
  id: Type.String(),
  userId: Type.String(),
  roleIds: Type.Array(Type.String()),
  groupIds: Type.Array(Type.String()),
  companyId: Type.String(),
  isActive: Type.Boolean(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
});

// DTOs
export const CreateActionDto = Type.Omit(ActionSchema, [
  "id",
  "createdAt",
  "updatedAt",
  "isActive",
]);
export const UpdateActionDto = Type.Partial(Type.Omit(ActionSchema, ["id"]));

export const CreateRoleDto = Type.Omit(RoleSchema, [
  "id",
  "createdAt",
  "updatedAt",
  "isActive",
  "companyId",
]);
export const UpdateRoleDto = Type.Partial(
  Type.Omit(RoleSchema, ["id", "companyId"])
);

export const CreateGroupDto = Type.Omit(GroupSchema, [
  "id",
  "createdAt",
  "updatedAt",
  "isActive",
  "companyId",
]);
export const UpdateGroupDto = Type.Partial(
  Type.Omit(GroupSchema, ["id", "companyId"])
);

export const AssignUserRolesDto = Type.Object({
  roleIds: Type.Array(Type.String()),
});

export const AssignUserGroupsDto = Type.Object({
  groupIds: Type.Array(Type.String()),
});

// Export types
export type Action = Static<typeof ActionSchema>;
export type Role = Static<typeof RoleSchema>;
export type Group = Static<typeof GroupSchema>;
export type UserRoles = Static<typeof UserRolesSchema>;

export type TCreateActionDto = Static<typeof CreateActionDto>;
export type TUpdateActionDto = Static<typeof UpdateActionDto>;
export type TCreateRoleDto = Static<typeof CreateRoleDto>;
export type TUpdateRoleDto = Static<typeof UpdateRoleDto>;
export type TCreateGroupDto = Static<typeof CreateGroupDto>;
export type TUpdateGroupDto = Static<typeof UpdateGroupDto>;

// Add TypeOf exports for request/response typing
export const ActionSchemaTypeOf = {
  Response: Type.Object({
    data: ActionSchema,
  }),
  ListResponse: Type.Object({
    data: Type.Array(ActionSchema),
  }),
};

export const RoleSchemaTypeOf = {
  Response: Type.Object({
    data: RoleSchema,
  }),
  ListResponse: Type.Object({
    data: Type.Array(RoleSchema),
  }),
};

export const GroupSchemaTypeOf = {
  Response: Type.Object({
    data: GroupSchema,
  }),
  ListResponse: Type.Object({
    data: Type.Array(GroupSchema),
  }),
};

export const UserRolesSchemaTypeOf = {
  Response: Type.Object({
    data: UserRolesSchema,
  }),
  ListResponse: Type.Object({
    data: Type.Array(UserRolesSchema),
  }),
};

// Add TypeOf types
export type ActionResponse = Static<typeof ActionSchemaTypeOf.Response>;
export type ActionListResponse = Static<typeof ActionSchemaTypeOf.ListResponse>;

export type RoleResponse = Static<typeof RoleSchemaTypeOf.Response>;
export type RoleListResponse = Static<typeof RoleSchemaTypeOf.ListResponse>;

export type GroupResponse = Static<typeof GroupSchemaTypeOf.Response>;
export type GroupListResponse = Static<typeof GroupSchemaTypeOf.ListResponse>;

export type UserRolesResponse = Static<typeof UserRolesSchemaTypeOf.Response>;
export type UserRolesListResponse = Static<
  typeof UserRolesSchemaTypeOf.ListResponse
>;
