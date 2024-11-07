import fp from "fastify-plugin";

import { TResponse as GetUserSchemaBody } from "./schema/getUserInfoSchema";
import { createUserType, TBody as BodySchema } from "./schema/createUserSchema";
import { ObjectId } from "mongodb";

export default fp(async (fastify) => {
  const getUsers = async () => {
    const result = await fastify.mongo.collection("users").find().toArray();

    return result;
  };

  const createUser = async (user: BodySchema) => {
    //check if user already exists
    const existingUser = await fastify.mongo.collection("users").findOne({
      $or: [{ username: user.username }, { phone: user.phone }],
    });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const result = await fastify.mongo.collection("users").insertOne({
      ...user,
      _id: new ObjectId(),
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    return result;
  };

  // Decorate the fastify instance with the departmentService
  // @ts-ignore
  fastify.decorate("usersService", {
    getUsers,
    createUser,
  });
});

declare module "fastify" {
  interface FastifyInstance {
    usersService: {
      getUsers: () => Promise<GetUserSchemaBody | null>;
      createUser: (user: BodySchema) => Promise<createUserType | null>;
    };
  }
}
