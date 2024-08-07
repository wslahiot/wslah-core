import { getUserInfoSchema } from "./schema/getUserInfoSchema";

const users = async (fastify: any): Promise<void> => {
  // api to get specific user
  fastify.route({
    method: "GET",
    url: "/",
    schema: getUserInfoSchema,
    // preHandler: [fastify.authenticate],
    handler: async () => {
      return await fastify.usersService.getUsers();
    },
  });
};

export default users;
