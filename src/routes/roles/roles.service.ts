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
    console.log("getCustomers");
    const result = await fastify.mongo.collection("customers").find().toArray();
    console.log(result);
    return result;
  };

  const getCustomersById = async (id: string) => {
    console.log("getCustomers", id);
    const result = await fastify.mongo
      .collection("customers")
      .find({
        idNumber: id,
      })
      .toArray();
    console.log(result);
    return result;
  };

  const createCustomer = async (customer: BodySchema) => {
    //check if customer already exists
    const existingUser = await fastify.mongo.collection("customers").findOne({
      idNumber: customer.idNumber,
    });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const result = await fastify.mongo.collection("customers").insertOne({
      ...customer,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    return result;
  };

  // Decorate the fastify instance with the departmentService
  // @ts-ignore
  fastify.decorate("rolesService", {
    getCustomers,
    getCustomersById,
    createCustomer,
  });
});

declare module "fastify" {
  interface FastifyInstance {
    rolesService: {
      getCustomers: () => Promise<GetCustomerSchema | null>;
      getCustomersById: (
        id: GetCustomerByIdSchema
      ) => Promise<GetCustomerSchema | null>;
      createCustomer: (user: BodySchema) => Promise<createCustomerType | null>;
    };
  }
}
