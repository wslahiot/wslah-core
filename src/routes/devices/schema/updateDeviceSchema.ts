import { Static, Type } from "@sinclair/typebox";

const IParams = Type.Object({
  id: Type.String(),
});
export type TParams = Static<typeof IParams>;

const IResponse = Type.Object({
  status: Type.String(),
  message: Type.String(),
});

export const IBody = Type.Object({
  name: Type.Optional(Type.String()),
  deviceType: Type.Optional(Type.String()),
  brand: Type.Optional(Type.String()),
  isConnectedToNetwork: Type.Optional(Type.Boolean()),
  status: Type.Optional(Type.Boolean()),
  location: Type.Optional(Type.String()),
  batteryLevel: Type.Optional(Type.Number()),
});

export type TBody = Static<typeof IBody>;
export type TResponse = Static<typeof IResponse>;

const IError = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});

export const updateDeviceSchema = {
  tags: ["Devices"],
  deprecated: false,
  summary: "Update device",
  description: "Update an existing device",
  params: IParams,
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