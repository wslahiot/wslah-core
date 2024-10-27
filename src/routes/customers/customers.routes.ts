import { createCustomerSchema } from "./schema/createCustomerSchema";
import {
  getCustomerByIdSchema,
  getCustomerSchema,
} from "./schema/getCustomerInfoSchema";

const users = async (fastify: any): Promise<void> => {
  // api to get specific user
  fastify.route({
    method: "GET",
    url: "/",
    schema: getCustomerSchema,
    preHandler: [fastify.authenticate],
    handler: async () => {
      return await fastify.customersService.getCustomers();
    },
  });
  // Create a new user
  fastify.route({
    method: "POST",
    url: "/",
    schema: createCustomerSchema,
    // preHandler: [fastify.authenticate],
    handler: async (request: any) => {
      const user = request.body;
      return await fastify.customersService.createCustomer(user);
    },
  });

  fastify.route({
    method: "GET",
    url: "/:id",
    schema: getCustomerByIdSchema,
    // preHandler: [fastify.authenticate],
    handler: async (request: any) => {
      const { id } = request.params;
      return await fastify.customersService.getCustomersById(id);
    },
  });
};

export default users;
