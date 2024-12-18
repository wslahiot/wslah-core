import { Static, Type } from "@sinclair/typebox";

const IHeader = Type.Object({
  "x-custom-key": Type.Optional(Type.String()),
});
type THeader = Static<typeof IHeader>;

const IParams = Type.Object({});
type TParams = Static<typeof IParams>;

const IResponse = Type.Object({
  message: Type.String(),
});

export const IBody = Type.Array(
  Type.Object({
    companyId: Type.String(),
    unitId: Type.Optional(Type.String()),
    deviceType: Type.String(),
    brand: Type.String(),
    isPublic: Type.Boolean(),
    isConnectedToNetwork: Type.Boolean(),
    status: Type.String(),
    lastMaintenanceDate: Type.String(),
    updatedAt: Type.String(),
  })
);

export type TBody = Static<typeof IBody>;

export type TResponse = Static<typeof IResponse>;

const IError = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});
type TError = Static<typeof IError>;

export type createEntityType = {
  Header: THeader;
  Params: TParams;
  Response: TResponse;
  Error: TError;
};

export const createDeviceSchema = {
  tags: ["Devices"],
  deprecated: false,
  summary: "Create new device",
  description: "create new device",
  body: IBody,
  response: {
    200: IResponse,
    400: IError,
    404: IError,
    500: IError,
  },
};

import fp from "fastify-plugin";

export default fp(async (fastify) => {});
