import fp from "fastify-plugin";
import fastifyJwt, { FastifyJWTOptions } from "@fastify/jwt";

export type decodeType = {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyId: string;
  iat: number;
};

export default fp<FastifyJWTOptions>(async (fastify) => {
  fastify.register(fastifyJwt, {
    secret: process.env.SECRET_KEY || "secret",
  });

  fastify.decorate("authenticate", async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch (err: any) {
      reply
        .code(401)
        .send({ message: "Authentication failed", error: err.message });
    }
  });

  fastify.decorate("decode", function (request) {
    try {
      let token = request;
      if (token.includes("Bearer")) {
        token = token.split(" ")[1];
      }
      const res = fastify.jwt.decode(token);

      if (!res) {
        return { error: "Invalid token" };
      }

      return res;
    } catch (err: any) {
      return { error: err.message };
    }
  });
});

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
    decode: (token: string) => any;
  }
}
