import { Type } from "@sinclair/typebox";

export const getOpenStateSchema = {
  tags: ["TTLock"],
  summary: "Get open state",
  description: "Get the open state of a lock",
  params: Type.Object({
    lockId: Type.String(),
  }),
  response: {
    200: Type.Object({
      state: Type.Number(),
      success: Type.Boolean(),
    }),
  },
};
