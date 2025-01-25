import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { createReservationSchema } from "./schema/createReservationSchema";
import { getReservationSchema } from "./schema/getReservationSchema";
import { getReservationsSchema } from "./schema/getReservationsSchema";
import { updateReservationSchema } from "./schema/updateReservationSchema";
import { deleteReservationSchema } from "./schema/deleteReservationSchema";
import { availabilitySchema } from "./schema/availabilitySchema";
import { ReservationsService } from "./reservations.service";

const reservations: FastifyPluginAsyncTypebox = async (
  fastify
): Promise<void> => {
  const service = ReservationsService(fastify) as any;

  fastify.decorate("reservationsService", service);

  fastify.route({
    method: "GET",
    url: "/",
    schema: getReservationsSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: any) => {
      const decoded = request.user as any;

      const reservations = await fastify.reservationsService.getReservations(
        decoded.companyId
      );
      return reservations || [];
    },
  });

  fastify.route({
    method: "POST",
    url: "/",
    schema: createReservationSchema,
    handler: async (request, reply) => {
      const result = await fastify.reservationsService.createReservation(
        request.body
      );

      if (result.status === "success") {
        return {
          status: "success",
          message: "Reservation created",
        };
      }
      return {
        status: "error",
        message: result.message,
      };
    },
  });

  fastify.route({
    method: "GET",
    url: "/:id",
    schema: getReservationSchema,
    handler: async (request: any) => {
      const reservation = await fastify.reservationsService.getReservationById(
        request.params.id
      );
      return reservation;
    },
  });

  fastify.route({
    method: "PUT",
    url: "/:id",
    schema: updateReservationSchema,

    handler: async (request: any) => {
      const reservation = await fastify.reservationsService.updateReservation(
        request.params.id,
        request.body
      );
      return reservation || null;
    },
  });

  fastify.route({
    method: "DELETE",
    url: "/:id",
    schema: deleteReservationSchema,

    handler: async (request: any) => {
      const reservation = await fastify.reservationsService.deleteReservation(
        request.params.id
      );
      return reservation || null;
    },
  });

  fastify.route({
    method: "GET",
    url: "/availability/:unitId/:date",
    schema: availabilitySchema,
    handler: async (request: any) => {
      const { unitId, date } = request.params as {
        unitId: string;
        date: string;
      };
      const availableHours =
        await fastify.reservationsService.getAvailableHours(unitId, date);
      return availableHours || [];
    },
  });
};

export default reservations;
