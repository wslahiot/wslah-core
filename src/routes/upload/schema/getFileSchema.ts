import { Static, Type } from "@sinclair/typebox";
import { IEntityParams } from "./common";

export const IParams = Type.Intersect([
  IEntityParams,
  Type.Object({
    fileId: Type.String(),
  }),
]);

export type TParams = Static<typeof IParams>;

const IResponse = Type.Object({
  url: Type.String(),
  fileId: Type.String(),
});

export type TResponse = Static<typeof IResponse>;

const IError = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});

export const getFileSchema = {
  tags: ["Upload"],
  deprecated: false,
  summary: "Get file URL",
  description: "Get file URL by ID",
  params: IParams,
  response: {
    200: IResponse,
    400: IError,
    500: IError,
  },
};
