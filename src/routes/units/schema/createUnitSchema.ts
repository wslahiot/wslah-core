import { Static, Type } from "@sinclair/typebox";
import { ErrorSchema } from "./types";

export const CreateUnitBody = Type.Object({
  entityId: Type.Optional(Type.String()),
  name: Type.String(),
  isPublic: Type.Boolean({ default: false }),
  lastMaintenanceDate: Type.Optional(Type.String()),
});

const CreateUnitResponse = Type.Object({
  status: Type.String(),
  message: Type.String(),
});

export type TCreateUnitBody = Static<typeof CreateUnitBody>;
export type TCreateUnitResponse = Static<typeof CreateUnitResponse>;

export const createUnitSchema = {
  tags: ["Units"],
  summary: "Create new unit",
  description: "Create a new unit in the system",
  body: CreateUnitBody,
  response: {
    201: CreateUnitResponse,
    400: ErrorSchema,
    401: ErrorSchema,
    500: ErrorSchema,
  },
};

import fp from "fastify-plugin";

export default fp(async (fastify) => {});
