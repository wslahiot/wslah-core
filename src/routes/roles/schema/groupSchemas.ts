import { Type } from "@sinclair/typebox";
import { CommonErrorSchema, CommonSuccessSchema, ParamsWithId } from "./common";
import { GroupSchema, CreateGroupDto, UpdateGroupDto } from "./types";

export const createGroupSchema = {
  tags: ["Groups"],
  summary: "Create new group",
  description: "Create a new group with specified roles",
  body: CreateGroupDto,
  response: {
    201: CommonSuccessSchema,
    400: CommonErrorSchema,
    401: CommonErrorSchema,
    500: CommonErrorSchema,
  },
};

export const updateGroupSchema = {
  tags: ["Groups"],
  summary: "Update group",
  description: "Update an existing group's details and roles",
  params: ParamsWithId,
  body: UpdateGroupDto,
  response: {
    200: CommonSuccessSchema,
    400: CommonErrorSchema,
    401: CommonErrorSchema,
    404: CommonErrorSchema,
    500: CommonErrorSchema,
  },
};

export const getGroupsSchema = {
  tags: ["Groups"],
  summary: "Get all groups",
  description: "Retrieve all groups for the authenticated company",
  response: {
    200: Type.Array(GroupSchema),
    401: CommonErrorSchema,
    500: CommonErrorSchema,
  },
};

export const getGroupByIdSchema = {
  tags: ["Groups"],
  summary: "Get group by ID",
  description: "Retrieve a specific group by its ID",
  params: ParamsWithId,
  response: {
    200: GroupSchema,
    401: CommonErrorSchema,
    404: CommonErrorSchema,
    500: CommonErrorSchema,
  },
};

export const deleteGroupSchema = {
  tags: ["Groups"],
  summary: "Delete group",
  description: "Soft delete a group by ID",
  params: ParamsWithId,
  response: {
    200: CommonSuccessSchema,
    401: CommonErrorSchema,
    404: CommonErrorSchema,
    500: CommonErrorSchema,
  },
};
