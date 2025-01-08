import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { FastifyRequest } from "fastify";
import { createOtpSchema } from "./schema/createOtpSchema";
import { verifyOtpSchema } from "./schema/verifyOtpSchema";
import { sendSmsSchema } from "./schema/sendSmsSchema";

const messages: FastifyPluginAsyncTypebox = async (
  fastify: any
): Promise<void> => {
  fastify.route({
    method: "POST",
    url: "/send-sms",
    schema: sendSmsSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: FastifyRequest) => {
      const { body } = request;
      return await fastify.messagesService.sendSms(body);
    },
  });

  fastify.route({
    method: "POST",
    url: "/create-otp",
    schema: createOtpSchema,
    // preHandler: [fastify.authenticate],
    handler: async (request: FastifyRequest) => {
      const { body } = request;
      return await fastify.messagesService.createOtp(body);
    },
  });

  fastify.route({
    method: "POST",
    url: "/verify-otp",
    schema: verifyOtpSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: FastifyRequest) => {
      const { body } = request;
      return await fastify.messagesService.verifyOtp(body);
    },
  });
};

export default messages;
