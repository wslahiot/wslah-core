import { Static, Type } from "@sinclair/typebox";

const IParams = Type.Object({
  id: Type.String(),
});
export type TParams = Static<typeof IParams>;

const IResponse = Type.Object({
  id: Type.String(),
  companyId: Type.String(),
  unitId: Type.String(),
  deviceId: Type.String(),
  name: Type.String(),
  deviceType: Type.String(),
  isSync: Type.Boolean(),
  brand: Type.String(),
  isConnectedToNetwork: Type.Boolean(),
  status: Type.Boolean(),
  location: Type.Optional(Type.String()),
  batteryLevel: Type.Optional(Type.Number()),
  createdAt: Type.String(),
  updatedAt: Type.String(),
});

export type TResponse = Static<typeof IResponse>;

const IError = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});

export const getDeviceByIdSchema = {
  tags: ["Devices"],
  deprecated: false,
  summary: "Get device by ID",
  description: "Get specific device details by ID",
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
