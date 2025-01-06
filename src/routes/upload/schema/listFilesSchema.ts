import { Static, Type } from "@sinclair/typebox";

const IResponse = Type.Array(
  Type.Object({
    fileId: Type.String(),
    url: Type.String(),
    mimetype: Type.String(),
    createdAt: Type.String(),
  })
);

export type TResponse = Static<typeof IResponse>;

const IError = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});

export const listFilesSchema = {
  tags: ["Upload"],
  deprecated: false,
  summary: "List files",
  description: "List all files",
  response: {
    200: IResponse,
    400: IError,
    500: IError,
  },
}; 