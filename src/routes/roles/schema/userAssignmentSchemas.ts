import { Type } from "@sinclair/typebox";
import { CommonErrorSchema, CommonSuccessSchema } from "./common";
import { AssignUserRolesDto } from "./types";

export const assignUserRolesSchema = {
  tags: ["Roles"],
  summary: "Assign roles to user",
  description: "Assign specific roles to a user",
  params: Type.Object({
    userId: Type.String(),
  }),
  body: AssignUserRolesDto,
  response: {
    200: CommonSuccessSchema,
    400: CommonErrorSchema,
    401: CommonErrorSchema,
    500: CommonErrorSchema,
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
    200: Type.Object({
      roles: Type.Array(
        Type.Object({
          id: Type.String(),
          name: Type.String(),
        })
      ),
      groups: Type.Array(
        Type.Object({
          id: Type.String(),
          name: Type.String(),
        })
      ),
      actions: Type.Array(
        Type.Object({
          code: Type.String(),
          name: Type.String(),
          module: Type.String(),
        })
      ),
    }),
    401: CommonErrorSchema,
    404: CommonErrorSchema,
    500: CommonErrorSchema,
  },
};
