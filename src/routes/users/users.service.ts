import fp from "fastify-plugin";

import { TResponse as GetUserSchemaBody } from "./schema/getUserInfoSchema";
import { createUserType, TBody as BodySchema } from "./schema/createUserSchema";

import { v4 } from "uuid";

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
      return { message: "User already exists" };
    }

    try {
      await fastify.mongo.collection("users").insertOne({
        ...user,
        id: v4(),
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });

      return { status: "success", message: "inserted successfully" };
    } catch (error: any) {
      console.error("Failed to insert user:", error);
      return { message: "Failed to insert user: " + error.message };
    }
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
