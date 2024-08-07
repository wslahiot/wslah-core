import fp from "fastify-plugin";

import { TResponse as GetUserSchemaBody } from "./schema/getUserInfoSchema";

export default fp(async (fastify) => {
  const getUsers = async () => {
    const result = await fastify.mongo.collection("users").find().toArray();
    console.log(result);
    return result;
  };

  // Decorate the fastify instance with the departmentService
  // @ts-ignore
  fastify.decorate("usersService", {
    getUsers,
  });
});

declare module "fastify" {
  interface FastifyInstance {
    usersService: {
      getUsers: () => Promise<GetUserSchemaBody | null>;
    };
  }
}
