import { Static, Type } from "@sinclair/typebox";
import { ErrorSchema } from "./types";

const UpdateUnitBody = Type.Object({}, { additionalProperties: true });

const UpdateUnitParams = Type.Object({
  id: Type.String(),
});

const UpdateUnitResponse = Type.Object({
  status: Type.String(),
  message: Type.String(),
  data: Type.Object({
    // id: Type.String(),
    companyId: Type.String(),
    name: Type.String(),
    createdAt: Type.String(),
    updatedAt: Type.String(),
  }),
});

export type TUpdateUnitParams = Static<typeof UpdateUnitParams>;
export type TUpdateUnitResponse = Static<typeof UpdateUnitResponse>;
export type TUpdateUnitBody = Static<typeof UpdateUnitBody>;

export const updateUnitSchema = {
  tags: ["Units"],
  summary: "Update unit",
  description: "Update an existing unit by ID",
  params: UpdateUnitParams,
  body: UpdateUnitBody,
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
