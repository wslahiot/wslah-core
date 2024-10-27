import { createUsersSchema } from "./schema/createUserSchema";
import { getUserSchema, getUserByIdSchema } from "./schema/getUserInfoSchema";

const users = async (fastify: any): Promise<void> => {
  // api to get specific user
  fastify.route({
    method: "GET",
    url: "/",
    schema: getUserSchema,
    // preHandler: [fastify.authenticate],
    handler: async () => {
      return await fastify.usersService.getUsers();
    },
  });
  // Create a new user
  fastify.route({
    method: "POST",
    url: "/",
    schema: createUsersSchema,
    // preHandler: [fastify.authenticate],
    handler: async (request: any) => {
      const user = request.body;
      return await fastify.usersService.createUser(user);
    },
  });
  //Example of a route

  fastify.route({
    method: "GET",
    url: "/:id",
    schema: getUserByIdSchema,
    handler: async (request: any) => {
      1;
      const id = request.params.id;
      const user = request.user;
      return await fastify.reportService.getReport(id, user.id);
    },
  });
};

export default users;
