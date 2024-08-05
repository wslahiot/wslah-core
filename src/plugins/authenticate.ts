import fp from "fastify-plugin";
import fastifyJwt, { FastifyJWTOptions } from "@fastify/jwt";

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

  fastify.decorate("decode", async function (token, reply) {
    try {
      const res = await fastify.jwt.decode(token);
      reply.send(res);
    } catch (err: any) {
      console.log(err);
      reply
        .code(500)
        .send({ message: "Failed to decode token", error: err.message });
    }
  });
});

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
    decode: (token: string, reply: FastifyReply) => Promise<void>;
  }
}
