import { Type } from "@sinclair/typebox";
import { CommonErrorSchema, CommonSuccessSchema, ParamsWithId } from "./common";
import { ActionSchema, CreateActionDto, UpdateActionDto } from "./types";

export const createActionSchema = {
  tags: ["Actions"],
  summary: "Create new action",
  description: "Create a new action in the system",
  body: CreateActionDto,
  response: {
    201: CommonSuccessSchema,
    400: CommonErrorSchema,
    401: CommonErrorSchema,
    500: CommonErrorSchema,
  },
};

export const updateActionSchema = {
  tags: ["Actions"],
  summary: "Update existing action",
  description: "Update an action's details",
  params: ParamsWithId,
  body: UpdateActionDto,
  response: {
    200: CommonSuccessSchema,
    400: CommonErrorSchema,
    401: CommonErrorSchema,
    404: CommonErrorSchema,
    500: CommonErrorSchema,
  },
};

export const getActionSchema = {
  tags: ["Actions"],
  summary: "Get action by ID",
  description: "Retrieve a specific action by its ID",
  params: ParamsWithId,
  response: {
    200: ActionSchema,
    404: CommonErrorSchema,
    500: CommonErrorSchema,
  },
};

export const getActionsSchema = {
  tags: ["Actions"],
  summary: "Get all actions",
  description: "Retrieve all actions in the system",
  response: {
    200: Type.Array(ActionSchema),
    500: CommonErrorSchema,
  },
};

export const deleteActionSchema = {
  tags: ["Actions"],
  summary: "Delete action",
  description: "Soft delete an action by ID",
  params: ParamsWithId,
  response: {
    200: CommonSuccessSchema,
    404: CommonErrorSchema,
    500: CommonErrorSchema,
  },
};
