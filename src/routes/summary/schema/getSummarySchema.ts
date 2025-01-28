import { Static, Type } from "@sinclair/typebox";

// const IResponse = Type.Object({
//   counts: Type.Object({
//     devices: Type.Number(),
//     customers: Type.Number(),
//     reservations: Type.Number(),
//     units: Type.Number(),
//     entities: Type.Number(),
//   }),
//   recentReservations: Type.Array(
//     Type.Object({
//       id: Type.String(),
//       unitId: Type.String(),
//       customerId: Type.Optional(Type.String()),
//       startDate: Type.String(),
//       endDate: Type.String(),
//       status: Type.String(),
//       unit: Type.Object({
//         id: Type.String(),
//         name: Type.String(),
//         entityId: Type.String(),
//       }),
//       createdAt: Type.String(),
//       updatedAt: Type.String(),
//     })
//   ),
//   deviceStatus: Type.Object({
//     online: Type.Number(),
//     offline: Type.Number(),
//   }),
// });

const IResponse = Type.Any();
export type TResponse = Static<typeof IResponse>;

const IError = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
});

export const getSummarySchema = {
  tags: ["Summary"],
  deprecated: false,
  summary: "Get dashboard summary",
  description: "Get summary statistics and recent activities",
  response: {
    // 200: IResponse,
    400: IError,
    404: IError,
    500: IError,
  },
};

export default async function (fastify: any) {}
