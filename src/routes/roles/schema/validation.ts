import { Type } from "@sinclair/typebox";
import {
  CreateActionDto,
  UpdateActionDto,
  CreateRoleDto,
  UpdateRoleDto,
  CreateGroupDto,
  UpdateGroupDto,
  AssignUserRolesDto,
  AssignUserGroupsDto,
} from "./types";

const ParamsWithId = Type.Object({
  id: Type.String(),
});

const ErrorResponse = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});

const SuccessResponse = Type.Object({
  status: Type.String(),
  message: Type.String(),
});

// Action Schemas
export const createActionSchema = {
  tags: ["Actions"],
  summary: "Create new action",
  body: CreateActionDto,
  response: {
    200: SuccessResponse,
    400: ErrorResponse,
    401: ErrorResponse,
    500: ErrorResponse,
  },
};

export const updateActionSchema = {
  tags: ["Actions"],
  summary: "Update action",
  params: ParamsWithId,
  body: UpdateActionDto,
  response: {
    200: SuccessResponse,
    400: ErrorResponse,
    401: ErrorResponse,
    404: ErrorResponse,
    500: ErrorResponse,
  },
};

// Role Schemas
export const createRoleSchema = {
  tags: ["Roles"],
  summary: "Create new role",
  body: CreateRoleDto,
  response: {
    200: SuccessResponse,
    400: ErrorResponse,
    401: ErrorResponse,
    500: ErrorResponse,
  },
};

export const getRoleSchema = {
  tags: ["Roles"],
  summary: "Get role by ID",
  params: ParamsWithId,
  response: {
    200: Type.Object({
      id: Type.String(),
      name: Type.String(),
      description: Type.Optional(Type.String()),
      actions: Type.Array(Type.String()),
      createdAt: Type.String(),
      updatedAt: Type.String(),
    }),
    404: ErrorResponse,
    500: ErrorResponse,
  },
};

export const updateRoleSchema = {
  tags: ["Roles"],
  summary: "Update role",
  params: ParamsWithId,
  body: UpdateRoleDto,
  response: {
    200: SuccessResponse,
    400: ErrorResponse,
    401: ErrorResponse,
    404: ErrorResponse,
    500: ErrorResponse,
  },
};

// Group Schemas
export const createGroupSchema = {
  tags: ["Groups"],
  summary: "Create new group",
  body: CreateGroupDto,
  response: {
    200: SuccessResponse,
    400: ErrorResponse,
    401: ErrorResponse,
    500: ErrorResponse,
  },
};

export const updateGroupSchema = {
  tags: ["Groups"],
  summary: "Update group",
  params: ParamsWithId,
  body: UpdateGroupDto,
  response: {
    200: SuccessResponse,
    400: ErrorResponse,
    401: ErrorResponse,
    404: ErrorResponse,
    500: ErrorResponse,
  },
};

// User Assignment Schemas
export const assignUserRolesSchema = {
  tags: ["Roles"],
  summary: "Assign roles to user",
  params: Type.Object({ userId: Type.String() }),
  body: AssignUserRolesDto,
  response: {
    200: SuccessResponse,
    400: ErrorResponse,
    401: ErrorResponse,
    500: ErrorResponse,
  },
};

export const assignUserGroupsSchema = {
  tags: ["Roles"],
  summary: "Assign groups to user",
  params: Type.Object({ userId: Type.String() }),
  body: AssignUserGroupsDto,
  response: {
    200: SuccessResponse,
    400: ErrorResponse,
    401: ErrorResponse,
    500: ErrorResponse,
  },
};

// Example schemas for GET endpoints
export const getActionSchema = {
  tags: ["Actions"],
  summary: "Get action by ID",
  description: "Get an action by its ID",
  params: Type.Object({
    id: Type.String(),
  }),
  response: {
    200: Type.Object({
      id: Type.String(),
      name: Type.String(),
      // ... other action properties
    }),
    404: Type.Object({
      message: Type.String(),
    }),
  },
};

export const getRolesSchema = {
  tags: ["Roles"],
  summary: "Get all roles",
  description: "Get all roles",
  response: {
    200: Type.Array(
      Type.Object({
        id: Type.String(),
        name: Type.String(),
        // ... other role properties
      })
    ),
  },
};

export const getUserPermissionsSchema = {
  tags: ["Roles"],
  summary: "Get user permissions",
  description: "Get all permissions for a specific user",
  params: Type.Object({
    userId: Type.String(),
  }),
  response: {
    200: Type.Array(Type.String()),
    403: Type.Object({
      message: Type.String(),
    }),
  },
};

// Add these new schemas

export const deleteActionSchema = {
  tags: ["Actions"],
  summary: "Delete action",
  description: "Delete an action by its ID",
  params: Type.Object({
    id: Type.String(),
  }),
  response: {
    200: Type.Object({
      success: Type.Boolean(),
    }),
  },
};

export const getActionsSchema = {
  tags: ["Actions"],
  summary: "Get all actions",
  description: "Get all actions",
  response: {
    200: Type.Array(
      Type.Object({
        id: Type.String(),
        name: Type.String(),
        description: Type.Optional(Type.String()),
        // Add other action properties
      })
    ),
  },
};

export const deleteRoleSchema = {
  tags: ["Roles"],
  summary: "Delete role",
  description: "Delete a role by its ID",
  params: Type.Object({
    id: Type.String(),
  }),
  response: {
    200: Type.Object({
      success: Type.Boolean(),
    }),
  },
};

export const getGroupsSchema = {
  tags: ["Groups"],
  summary: "Get all groups",
  description: "Get all groups",
  response: {
    200: Type.Array(
      Type.Object({
        id: Type.String(),
        name: Type.String(),
        description: Type.Optional(Type.String()),
        // Add other group properties
      })
    ),
  },
};

export const getGroupByIdSchema = {
  tags: ["Groups"],
  summary: "Get group by ID",
  description: "Get a group by its ID",
  params: Type.Object({
    id: Type.String(),
  }),
  response: {
    200: Type.Object({
      id: Type.String(),
      name: Type.String(),
      description: Type.Optional(Type.String()),
      // Add other group properties
    }),
  },
};

export const deleteGroupSchema = {
  tags: ["Groups"],
  summary: "Delete group",
  description: "Delete a group by its ID",
  params: Type.Object({
    id: Type.String(),
  }),
  response: {
    200: Type.Object({
      success: Type.Boolean(),
    }),
  },
};
