import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { FastifyRequest } from "fastify";
import { loginSchema } from "./schema/loginSchema";
import { signupSchema } from "./schema/signupSchema";
import { signupCompanySchema } from "./schema/signupCompanySchema";
import { verifySchema } from "./schema/verifySchema";

const auth: FastifyPluginAsyncTypebox = async (fastify: any): Promise<void> => {
  fastify.route({
    method: "POST",
    url: "/login",
    schema: loginSchema,
    handler: async (request: FastifyRequest) => {
      const { body } = request;
      return await fastify.authService.login(body);
    },
  });

  fastify.route({
    method: "POST",
    url: "/signup",
    schema: signupSchema,
    handler: async (request: FastifyRequest) => {
      const { body } = request;
      return await fastify.authService.signup(body);
    },
  });

  fastify.route({
    method: "POST",
    url: "/signup-company",
    schema: signupCompanySchema,
    handler: async (request: FastifyRequest) => {
      const { body } = request;
      return await fastify.authService.signupCompany(body);
    },
  });

  fastify.route({
    method: "GET",
    url: "/verify",
    schema: verifySchema,
    handler: async (request: FastifyRequest) => {
      const token = request.headers.authorization?.split(" ")[1];
      return await fastify.authService.verify(token);
    },
  });
};

export default auth;
