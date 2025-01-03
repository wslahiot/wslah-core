import { Static, Type } from "@sinclair/typebox";

const IHeader = Type.Object({
  "x-custom-key": Type.Optional(Type.String()),
});
type THeader = Static<typeof IHeader>;

const IParams = Type.Object({});
export type TParams = Static<typeof IParams>;

const IResponse = Type.Object({
  message: Type.String(),
  status: Type.String(),
});

export const IBody = Type.Array(
  Type.Object({
    companyId: Type.String(),
    unitId: Type.String(),
    deviceId: Type.String(),
    name: Type.String(),
    deviceType: Type.String(),
    isSync: Type.Boolean({ default: false }),
    brand: Type.String(),
    isConnectedToNetwork: Type.Boolean(),
    status: Type.Boolean(),
    location: Type.Optional(Type.String()),
    batteryLevel: Type.Optional(Type.Number()),
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
