import { Type } from "@sinclair/typebox";

export const CommonErrorSchema = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});

export const CommonSuccessSchema = Type.Object({
  status: Type.String(),
  message: Type.String(),
});

export const ParamsWithId = Type.Object({
  id: Type.String(),
});
