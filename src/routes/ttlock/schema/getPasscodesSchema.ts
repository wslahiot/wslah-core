import { Type } from "@sinclair/typebox";

export const getPasscodesSchema = {
  tags: ["TTlock"],
  summary: "Get passcodes",
  description: "Get passcodes for a lock",
  params: Type.Object({
    lockId: Type.String(),
  }),
  response: {
    200: Type.Array(
      Type.Object({
        keyboardPwdId: Type.String(),
        keyboardPwd: Type.String(),
        keyboardPwdName: Type.Optional(Type.String()),
        startDate: Type.Number(),
        endDate: Type.Number(),
        senderId: Type.Number(),
        status: Type.Number(),
      })
    ),
  },
};
