import fp from "fastify-plugin";

import {
  TResponse as GetCustomerSchema,
  TParams as GetCustomerByIdSchema,
} from "./schema/getCustomerInfoSchema";
import {
  TResponse as createCustomerType,
  TBody as BodySchema,
} from "./schema/createCustomerSchema";
// interface customerServiceType {
//   getCustomers: () => Promise<GetCustomerSchema | null>;
//   getCustomersById: (
//     id: GetCustomerByIdSchema
//   ) => Promise<GetCustomerSchema | null>;
//   createCustomer: (user: BodySchema) => Promise<createCustomerType | null>;
// }

export default fp(async (fastify) => {
  const getCustomers = async () => {
    const result = await fastify.mongo.collection("customers").find().toArray();

    return result;
  };

  const getCustomersById = async (id: string) => {
    const result = await fastify.mongo
      .collection("customers")
      .find({
        idNumber: id,
      })
      .toArray();

    return result;
  };

  const createCustomer = async (customer: BodySchema) => {
    //check if customer already exists
    const existingUser = await fastify.mongo.collection("customers").findOne({
      idNumber: customer.idNumber,
    });
    if (existingUser) {
      return { message: "Customer already exists" };
    }

    try {
      await fastify.mongo.collection("customers").insertOne({
        ...customer,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });

      return { status: "success", message: "inserted successfully" };
    } catch (error: any) {
      console.error("Failed to insert customer:", error);
      return { message: "Failed to insert customer: " + error.message };
    }
  };

  // Decorate the fastify instance with the departmentService
  // @ts-ignore
  fastify.decorate("customersService", {
    getCustomers,
    getCustomersById,
    createCustomer,
  });
});

declare module "fastify" {
  interface FastifyInstance {
    customersService: {
      getCustomers: () => Promise<GetCustomerSchema | null>;
      getCustomersById: (
        id: GetCustomerByIdSchema
      ) => Promise<GetCustomerSchema | null>;
      createCustomer: (user: BodySchema) => Promise<createCustomerType | null>;
    };
  }
}
