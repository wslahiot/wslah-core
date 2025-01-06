import { Static, Type } from "@sinclair/typebox";

export const IParams = Type.Object({
  fileId: Type.String(),
});

export type TParams = Static<typeof IParams>;

const IResponse = Type.Object({
  success: Type.Boolean(),
  fileId: Type.String(),
});

export type TResponse = Static<typeof IResponse>;

const IError = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});

export const deleteFileSchema = {
  tags: ["Upload"],
  deprecated: false,
  summary: "Delete file",
  description: "Delete file by ID",
  params: IParams,
  response: {
    200: IResponse,
    400: IError,
    500: IError,
  },
}; 