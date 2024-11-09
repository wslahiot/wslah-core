import { Static, Type } from "@sinclair/typebox";

// const IHeader = Type.Object({
//   "x-custom-key": Type.Optional(Type.String()),
// });
// type THeader = Static<typeof IHeader>;

// const IParams = Type.Object({});
// type TParams = Static<typeof IParams>;

export const IBody = Type.Array(
  Type.Object({
    id: Type.String(),
    // companyId: Type.String(),
    unitId: Type.Optional(Type.String()),
    deviceId: Type.String(),
    name: Type.String(),
    deviceType: Type.String(),
    isSync: Type.Boolean({ default: false }),
    brand: Type.String(),
    isConnectedToNetwork: Type.Optional(Type.Boolean()),
    status: Type.Boolean(),
    updatedAt: Type.String(),
    createdAt: Type.String(),
  })
);

// _id?: string;
// companyId: string;
// unitId: string;
// deviceId: string;
// name: string;
// deviceType: string;
// isSync: boolean;
// brand: string;
// isConnectedToNetwork: boolean;
// location?: string
// batteryLevel?: number
// status: boolean;
const IResponse = Type.Array(
  Type.Object(
    {
      // companyId: Type.String(),
      id: Type.String(),
      unitId: Type.Optional(Type.String()),
      deviceId: Type.String(),
      name: Type.String(),
      deviceType: Type.String(),
      isSync: Type.Boolean({ default: false }),
      brand: Type.String(),
      isConnectedToNetwork: Type.Optional(Type.Boolean()),
      status: Type.Boolean(),
      updatedAt: Type.String(),
      createdAt: Type.String(),
    },
    {
      additionalProperties: true,
    }
  )
);

export type TResponse = Static<typeof IResponse>;

const IError = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});

export const getDeviceSchema = {
  tags: ["Devices"],
  deprecated: false,
  summary: "Get devices info",
  description: "Get devices info",
  response: {
    200: IResponse,
    400: IError,
    404: IError,
    500: IError,
  },
};

import fp from "fastify-plugin";

export default fp(async (fastify) => {});
