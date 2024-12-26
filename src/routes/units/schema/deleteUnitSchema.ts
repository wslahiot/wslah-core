import { Static, Type } from "@sinclair/typebox";
import { ErrorSchema } from "./types";

const DeleteUnitParams = Type.Object({
  id: Type.String(),
});

const DeleteUnitResponse = Type.Object({
  status: Type.String(),
  message: Type.String(),
});

export type TDeleteUnitParams = Static<typeof DeleteUnitParams>;
export type TDeleteUnitResponse = Static<typeof DeleteUnitResponse>;

export const deleteUnitSchema = {
  tags: ["Units"],
  summary: "Delete unit",
  description: "Soft delete a unit by ID",
  params: DeleteUnitParams,
  response: {
    200: DeleteUnitResponse,
    401: ErrorSchema,
    404: ErrorSchema,
    500: ErrorSchema,
  },
};

import fp from "fastify-plugin";
export default fp(async (fastify) => {});
