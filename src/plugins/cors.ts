import fp from "fastify-plugin";
import cors, { FastifyCorsOptions } from "@fastify/cors";

export default fp<FastifyCorsOptions>(
  async (fastify) => {
    fastify.register(cors, {
      origin: ["http://localhost:3000", "https://wslah-ui.fly.dev"],
      exposedHeaders: ["x-total-count", "x-total-pages", "x-current-page"],
    });
  },
  { name: "cors" }
);
