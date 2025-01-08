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
      // // Validate the hours
      // validateReservationHours(data.reservedHours);

      // // Check availability
      // await checkAvailability(
      //   data.unitId,
      //   data.reservationDate,
      //   data.reservedHours
      // );

      const reservation = {
        id: v4(),
        unitId: data.unitId,
        customerInfo: data.customerInfo,
        reservationDate: data.reservationDate,
        reservedHours: data.reservedHours,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const companyId = await fastify.reservationsService.getCompanyId(
        data.unitId
      );

      console.log(companyId);

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

    getReservations: async () => {
      const reservations = await fastify.mongo
        .collection("reservations")
        .find()
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
      getReservations: () => Promise<any[]>;
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
