import fp from "fastify-plugin";
import { decodeType } from "../../plugins/authenticate";

export default fp(async (fastify) => {
  const getSummary = async (userInfo: decodeType) => {
    try {
      // Get counts from different collections
      const [
        devicesCount,
        customersCount,
        reservationsCount,
        unitsCount,
        entitiesCount,
      ] = await Promise.all([
        fastify.mongo
          .collection("devices")
          .countDocuments({ companyId: userInfo.companyId, isActive: true }),
        fastify.mongo
          .collection("customers")
          .countDocuments({ companyId: userInfo.companyId, isActive: true }),
        fastify.mongo
          .collection("reservations")
          .countDocuments({ companyId: userInfo.companyId }),
        fastify.mongo
          .collection("units")
          .countDocuments({ companyId: userInfo.companyId, isActive: true }),
        fastify.mongo
          .collection("entities")
          .countDocuments({ companyId: userInfo.companyId, isActive: true }),
      ]);

      // Get recent reservations
      const recentReservations = await fastify.mongo
        .collection("reservations")
        .aggregate([
          { $match: { companyId: userInfo.companyId } },
          { $sort: { createdAt: -1 } },
          { $limit: 5 },
          {
            $lookup: {
              from: "units",
              localField: "unitId",
              foreignField: "id",
              as: "unit",
            },
          },
          { $unwind: "$unit" },
        ])
        .toArray();

      // Get device status summary
      const deviceStatus = await fastify.mongo
        .collection("devices")
        .aggregate([
          { $match: { companyId: userInfo.companyId, isActive: true } },
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
        ])
        .toArray();

      return {
        counts: {
          devices: devicesCount,
          customers: customersCount,
          reservations: reservationsCount,
          units: unitsCount,
          entities: entitiesCount,
        },
        recentReservations,
        deviceStatus: {
          online: deviceStatus.find((item) => item._id === true)?.count || 0,
          offline: deviceStatus.find((item) => item._id === false)?.count || 0,
        },
      };
    } catch (error: any) {
      console.error("Failed to get summary:", error);
      throw new Error(`Failed to get summary: ${error.message}`);
    }
  };

  fastify.decorate("summaryService", {
    getSummary,
  });
});

declare module "fastify" {
  interface FastifyInstance {
    summaryService: {
      getSummary: (userInfo: decodeType) => Promise<{
        counts: {
          devices: number;
          customers: number;
          reservations: number;
          units: number;
          entities: number;
        };
        recentReservations: any[];
        deviceStatus: {
          online: number;
          offline: number;
        };
      }>;
    };
  }
}
