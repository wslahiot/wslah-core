import { Static, Type } from "@sinclair/typebox";

const IParams = Type.Object({
  id: Type.String(),
});
export type TParams = Static<typeof IParams>;

const IResponse = Type.Object({
  entities: Type.Array(
    Type.Object({
      id: Type.String(),
      name: Type.String(),
    })
  ),
  units: Type.Array(
    Type.Object({
      id: Type.String(),
      name: Type.String(),
    })
  ),
});

export type TResponse = Static<typeof IResponse>;

const IError = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});

export const getCompanyEntitiesAndUnitSchema = {
  tags: ["Company"],
  deprecated: false,
  summary: "Get company by ID",
  description: "Get specific company details by ID",
  params: IParams,
  response: {
    200: IResponse,
    400: IError,
    404: IError,
    500: IError,
  },
};

import fp from "fastify-plugin";
export default fp(async (fastify) => {});
