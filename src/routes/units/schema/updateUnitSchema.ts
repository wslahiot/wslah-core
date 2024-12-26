import { Static, Type } from "@sinclair/typebox";
import { ErrorSchema } from "./types";
import { CreateUnitBody } from "./createUnitSchema";

const UpdateUnitParams = Type.Object({
  id: Type.String(),
});

const UpdateUnitResponse = Type.Object({
  status: Type.String(),
  message: Type.String(),
});

export type TUpdateUnitParams = Static<typeof UpdateUnitParams>;
export type TUpdateUnitResponse = Static<typeof UpdateUnitResponse>;

export const updateUnitSchema = {
  tags: ["Units"],
  summary: "Update unit",
  description: "Update an existing unit by ID",
  params: UpdateUnitParams,
  body: CreateUnitBody,
  response: {
    200: UpdateUnitResponse,
    400: ErrorSchema,
    401: ErrorSchema,
    404: ErrorSchema,
    500: ErrorSchema,
  },
};

import fp from "fastify-plugin";

export default fp(async (fastify) => {});
