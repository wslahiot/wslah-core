import fp from "fastify-plugin";
import { v4 } from "uuid";
import { TResponse as GetReservationsSchema } from "./schema/getReservationsSchema";
import {
  TResponse as CreateReservationResponse,
  TBody as CreateReservationBody,
} from "./schema/createReservationSchema";
import {
  TResponse as UpdateReservationResponse,
  TBody as UpdateReservationBody,
} from "./schema/updateReservationSchema";
import { TResponse as DeleteReservationResponse } from "./schema/deleteReservationSchema";
import { decodeType } from "../../plugins/authenticate";

export default fp(async (fastify) => {
  const getReservations = async (userInfo: decodeType) => {
    try {
      const result = await fastify.mongo
        .collection("reservations")
        .find({
          companyId: userInfo.companyId,
          isActive: true,
        })
        .toArray();

      return result;
    } catch (error: any) {
      console.error("Failed to get reservations:", error);
      throw new Error(`Failed to get reservations: ${error.message}`);
    }
  };

  const getReservationById = async (userInfo: decodeType, id: string) => {
    try {
      const result = await fastify.mongo.collection("reservations").findOne({
        id,
        companyId: userInfo.companyId,
        isActive: true,
      });

      if (!result) {
        throw new Error("Reservation not found");
      }

      return result;
    } catch (error: any) {
      console.error("Failed to get reservation:", error);
      throw new Error(`Failed to get reservation: ${error.message}`);
    }
  };

  const createReservation = async (
    userInfo: decodeType,
    data: CreateReservationBody
  ) => {
    const payload = {
      id: v4(),
      companyId: userInfo.companyId,
      ...data,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await fastify.mongo.collection("reservations").insertOne(payload);
      return { status: "success", message: "Reservation created successfully" };
    } catch (error: any) {
      console.error("Failed to create reservation:", error);
      throw new Error(`Failed to create reservation: ${error.message}`);
    }
  };

  const updateReservation = async (
    userInfo: decodeType,
    id: string,
    data: UpdateReservationBody
  ) => {
    try {
      const result = await fastify.mongo.collection("reservations").updateOne(
        { id, companyId: userInfo.companyId, isActive: true },
        {
          $set: {
            ...data,
            updatedAt: new Date().toISOString(),
          },
        }
      );

      if (result.matchedCount === 0) {
        throw new Error("Reservation not found");
      }

      return { status: "success", message: "Reservation updated successfully" };
    } catch (error: any) {
      console.error("Failed to update reservation:", error);
      throw new Error(`Failed to update reservation: ${error.message}`);
    }
  };

  const deleteReservation = async (userInfo: decodeType, id: string) => {
    try {
      const result = await fastify.mongo.collection("reservations").updateOne(
        { id, companyId: userInfo.companyId, isActive: true },
        {
          $set: {
            isActive: false,
            updatedAt: new Date().toISOString(),
          },
        }
      );

      if (result.matchedCount === 0) {
        throw new Error("Reservation not found");
      }

      return { status: "success", message: "Reservation deleted successfully" };
    } catch (error: any) {
      console.error("Failed to delete reservation:", error);
      throw new Error(`Failed to delete reservation: ${error.message}`);
    }
  };

  fastify.decorate("reservationsService", {
    getReservations,
    getReservationById,
    createReservation,
    updateReservation,
    deleteReservation,
  } as any);
});

declare module "fastify" {
  interface FastifyInstance {
    reservationsService: {
      getReservations: (
        userInfo: decodeType
      ) => Promise<GetReservationsSchema | null>;
      getReservationById: (
        userInfo: decodeType,
        id: string
      ) => Promise<GetReservationsSchema[0] | null>;
      createReservation: (
        userInfo: decodeType,
        data: CreateReservationBody
      ) => Promise<CreateReservationResponse | null>;
      updateReservation: (
        userInfo: decodeType,
        id: string,
        data: UpdateReservationBody
      ) => Promise<UpdateReservationResponse | null>;
      deleteReservation: (
        userInfo: decodeType,
        id: string
      ) => Promise<DeleteReservationResponse | null>;
    };
  }
}
