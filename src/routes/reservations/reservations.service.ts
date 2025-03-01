import { v4 } from "uuid";

import {
  // TResponse as CreateReservationResponse,
  TBody as CreateReservationBody,
} from "./schema/createReservationSchema";
import {
  TResponse as UpdateReservationResponse,
  TBody as UpdateReservationBody,
} from "./schema/updateReservationSchema";
import { TResponse as DeleteReservationResponse } from "./schema/deleteReservationSchema";
import { TResponse as GetAvailableHoursResponse } from "./schema/availabilitySchema";
import { AVAILABLE_HOURS } from "../../utils/helper";

export const ReservationsService = (fastify: any) => {
  return {
    getCompanyId: async (unitId: string) => {
      const unit = await fastify.mongo
        .collection("units")
        .findOne({ id: unitId });

      return unit?.companyId;
    },
    createReservation: async (data: CreateReservationBody) => {
      try {
        const companyId = await fastify.reservationsService.getCompanyId(
          data.unitId
        );

        const reservation = {
          id: v4(),
          unitId: data.unitId,
          companyId,
          customerInfo: data.customerInfo,
          reservationDate: data.reservationDate,
          reservedHours: data.reservedHours,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const getMsgatCredi = await fastify.mongo
          .collection("ExternalConnections")
          .findOne({
            companyId,
            type: "msgat",
          });
        console.log({ getMsgatCredi });
        // if (getMsgatCredi) {
        //   const msgatCredi = await fastify.decryptPayload(
        //     getMsgatCredi.payload
        //   );

        //   console.log("FInished decrypting msgatCredi", { msgatCredi });
        //   //!integrating wit ttlock lock and generate passcode
        //   //generate random passcode from 6 digits
        //   const passcode = Math.floor(
        //     100000 + Math.random() * 900000
        //   ).toString();

        //   //  lockId: Type.String(),
        //   // passcode: Type.String(),
        //   // passcodeName: Type.String(),
        //   // startDate: Type.Optional(Type.String()),
        //   // endDate: Type.Optional(Type.String()),
        //   if (data.customerInfo.lockId) {
        //     const generatePasscode =
        //       await fastify.ttlockService.generatePasscode({
        //         lockId: data.customerInfo.lockId,
        //         passcode,
        //         passcodeName: `${data.customerInfo.name} - ${data.reservationDate}`,
        //         startDate: data.reservationDate,
        //         endDate: data.reservationDate,
        //       });

        //     if (generatePasscode.status === "success") {
        //       const payload = {
        //         userName: msgatCredi.userName,
        //         numbers: data.customerInfo.phone,
        //         userSender: msgatCredi.userSender,
        //         apiKey: msgatCredi.apiKey,
        //         msg: `🎉 مرحباً ${data.customerInfo.name}،
        //         لقد تم إنشاء حجزك بنجاح في الفترة المحددة أدناه:
        //         📅 التاريخ: ${data.reservationDate}
        //         ⏰ الساعات: ${data.reservedHours.join(", ")}

        //          الكود الخاص بك هو:
        //                       🔑 ${passcode}
        //                       نتمنى لك وقتاً ممتعاً! 😊

        //         لالغاء الحجز يرجى الضغط على الرابط التالي:
        //         https://wslah.co/calendar/cancel-reservation/${
        //           reservation.id
        //         }/${companyId}?mobile=${data.customerInfo.phone}`,
        //       };
        //       await fastify.messagesService.sendSms(payload);
        //     }
        //   }
        // }

        console.log({ reservation });
        const result = await fastify.mongo
          .collection("reservations")
          .insertOne(reservation);

        if (result.insertedId) {
          return {
            status: "success",
            message: "Reservation created",
          };
        }
        return {
          status: "error",
          message: "Reservation not created",
        };
      } catch (error: any) {
        console.error("Failed to create reservation:", error);
        throw new Error(`Failed to create reservation: ${error.message}`);
      }
    },

    getAvailableHours: async (unitId: string, date: string) => {
      const reservations = await fastify.mongo
        .collection("reservations")
        .find({
          unitId: unitId,
          reservationDate: date,
        })
        .toArray();

      const bookedHours = reservations.flatMap((res: any) => res.reservedHours);
      const availableHours = AVAILABLE_HOURS.filter(
        (hour) => !bookedHours.includes(hour)
      );

      return {
        date,
        availableHours,
        bookedHours,
      };
    },

    getReservations: async (companyId: string) => {
      const reservations = await fastify.mongo
        .collection("reservations")
        .aggregate([
          {
            $match: {
              companyId: companyId,
            },
          },
          {
            $lookup: {
              from: "units",
              localField: "unitId",
              foreignField: "id",
              as: "unit",
            },
          },
          {
            $unwind: "$unit",
          },
          {
            $lookup: {
              from: "entities",
              localField: "unit.entityId",
              foreignField: "id",
              as: "entity",
            },
          },
          {
            $unwind: {
              path: "$entity",
              preserveNullAndEmptyArrays: true,
            },
          },
        ])
        .toArray();

      return reservations;
    },

    getReservationById: async (id: string) => {
      const reservation = await fastify.mongo
        .collection("reservations")
        .findOne({ id });
      return reservation;
    },

    updateReservation: async (id: string, data: UpdateReservationBody) => {
      const reservation = await fastify.mongo
        .collection("reservations")
        .updateOne({ id }, { $set: data });

      if (reservation.modifiedCount === 0) {
        return {
          status: "error",
          message: "Reservation not found",
        };
      }

      return {
        status: "success",
        message: "Reservation updated",
      };
    },

    deleteReservation: async (id: string) => {
      const reservation = await fastify.mongo
        .collection("reservations")
        .deleteOne({ id });

      if (reservation.deletedCount === 0) {
        return {
          status: "error",
          message: "Reservation not found",
        };
      }

      return {
        status: "success",
        message: "Reservation deleted",
      };
    },

    getReservationsByUnitId: async (unitId: string) => {
      const reservations = await fastify.mongo
        .collection("reservations")
        .find({ unitId })
        .toArray();
      return reservations;
    },
  };
};

declare module "fastify" {
  interface FastifyInstance {
    reservationsService: {
      getReservations: (companyId: string) => Promise<any[]>;
      getReservationsByUnitId: (unitId: string) => Promise<any[]>;
      getReservationById: (id: string) => Promise<any>;
      createReservation: (data: CreateReservationBody) => Promise<{
        status: string;
        message: string;
        reservationId?: string;
        reservation?: any;
      }>;
      updateReservation: (
        id: string,
        data: UpdateReservationBody
      ) => Promise<UpdateReservationResponse>;
      deleteReservation: (id: string) => Promise<DeleteReservationResponse>;
      getAvailableHours: (
        unitId: string,
        date: string
      ) => Promise<GetAvailableHoursResponse>;
    };
  }
}
