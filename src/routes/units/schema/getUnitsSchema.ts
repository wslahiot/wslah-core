import { Static, Type } from "@sinclair/typebox";
import { UnitSchema, ErrorSchema } from "./types";

const GetUnitsResponse = Type.Array(UnitSchema);

export type TGetUnitsResponse = Static<typeof GetUnitsResponse>;

export const getUnitsSchema = {
  tags: ["Units"],
  summary: "Get all units",
  description: "Retrieve all units for the authenticated company",
  response: {
    200: GetUnitsResponse,
    401: ErrorSchema,
    500: ErrorSchema,
  },
};

// For getting unit by ID
const GetUnitParams = Type.Object({
  id: Type.String(),
});

export const getUnitByIdSchema = {
  tags: ["Units"],
  summary: "Get unit by ID",
  description: "Retrieve a specific unit by its ID",
  params: GetUnitParams,
  response: {
    200: UnitSchema,
    401: ErrorSchema,
    404: ErrorSchema,
    500: ErrorSchema,
  },
};

import fp from "fastify-plugin";

export default fp(async (fastify) => {});
