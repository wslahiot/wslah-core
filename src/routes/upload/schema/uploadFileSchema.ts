import { Static, Type } from "@sinclair/typebox";

export const IBody = Type.Object({
  file: Type.Any(),
  mimetype: Type.String(),
});

export type TBody = Static<typeof IBody>;

const IResponse = Type.Object({
  fileId: Type.String(),
  url: Type.String(),
});

export type TResponse = Static<typeof IResponse>;

const IError = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});

export const uploadFileSchema = {
  tags: ["Upload"],
  deprecated: false,
  summary: "Upload file",
  description: "Upload a new file",
  
  body: IBody,
  response: {
    200: IResponse,
    400: IError,
    500: IError,
  },
};
