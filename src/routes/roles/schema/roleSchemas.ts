import { Type } from "@sinclair/typebox";
import { CommonErrorSchema, CommonSuccessSchema, ParamsWithId } from "./common";
import { RoleSchema, CreateRoleDto, UpdateRoleDto } from "./types";

export const createRoleSchema = {
  tags: ["Roles"],
  summary: "Create new role",
  description: "Create a new role with specified permissions",
  body: CreateRoleDto,
  response: {
    201: CommonSuccessSchema,
    400: CommonErrorSchema,
    401: CommonErrorSchema,
    500: CommonErrorSchema,
  },
};

export const updateRoleSchema = {
  tags: ["Roles"],
  summary: "Update role",
  description: "Update an existing role's details and permissions",
  params: ParamsWithId,
  body: UpdateRoleDto,
  response: {
    200: CommonSuccessSchema,
    400: CommonErrorSchema,
    401: CommonErrorSchema,
    404: CommonErrorSchema,
    500: CommonErrorSchema,
  },
};

export const getRolesSchema = {
  tags: ["Roles"],
  summary: "Get all roles",
  description: "Retrieve all roles for the authenticated company",
  response: {
    200: Type.Array(RoleSchema),
    401: CommonErrorSchema,
    500: CommonErrorSchema,
  },
};

export const deleteRoleSchema = {
  tags: ["Roles"],
  summary: "Delete role",
  description: "Soft delete a role by ID",
  params: ParamsWithId,
  response: {
    200: CommonSuccessSchema,
    401: CommonErrorSchema,
    404: CommonErrorSchema,
    500: CommonErrorSchema,
  },
};
