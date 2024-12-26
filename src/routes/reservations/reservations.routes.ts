import { FastifyRequest } from "fastify";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { createReservationSchema } from "./schema/createReservationSchema";
import { getReservationsSchema } from "./schema/getReservationsSchema";
import { updateReservationSchema } from "./schema/updateReservationSchema";
import { deleteReservationSchema } from "./schema/deleteReservationSchema";

const reservations: FastifyPluginAsyncTypebox = async (
  fastify: any
): Promise<void> => {
  fastify.route({
    method: "GET",
    url: "/",
    schema: getReservationsSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: FastifyRequest) => {
      const decoded = fastify.decode(request.headers.authorization);
      return await fastify.reservationsService.getReservations(decoded);
    },
  });

  fastify.route({
    method: "POST",
    url: "/",
    schema: createReservationSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: FastifyRequest) => {
      const { body } = request;
      const decoded = fastify.decode(request.headers.authorization);
      return await fastify.reservationsService.createReservation(decoded, body);
    },
  });

  fastify.route({
    method: "PUT",
    url: "/:id",
    schema: updateReservationSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: FastifyRequest) => {
      const { id } = request.params as { id: string };
      const { body } = request;
      const decoded = fastify.decode(request.headers.authorization);
      return await fastify.reservationsService.updateReservation(
        decoded,
        id,
        body
      );
    },
  });

  fastify.route({
    method: "DELETE",
    url: "/:id",
    schema: deleteReservationSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: FastifyRequest) => {
      const { id } = request.params as { id: string };
      const decoded = fastify.decode(request.headers.authorization);
      return await fastify.reservationsService.deleteReservation(decoded, id);
    },
  });

  fastify.route({
    method: "GET",
    url: "/:id",
    schema: getReservationsSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: FastifyRequest) => {
      const { id } = request.params as { id: string };
      const decoded = fastify.decode(request.headers.authorization);
      return await fastify.reservationsService.getReservationById(decoded, id);
    },
  });
};

export default reservations;
