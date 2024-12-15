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

  const updateCustomer = async (id: string, data: Partial<BodySchema>) => {
    try {
      const result = await fastify.mongo.collection("customers").updateOne(
        { idNumber: id },
        {
          $set: {
            ...data,
            updatedAt: new Date().toISOString(),
          },
        }
      );

      if (result.matchedCount === 0) {
        throw new Error("Customer not found");
      }

      return { status: "success", message: "Customer updated successfully" };
    } catch (error: any) {
      console.error("Failed to update customer:", error);
      throw new Error(`Failed to update customer: ${error.message}`);
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      const result = await fastify.mongo
        .collection("customers")
        .updateOne(
          { idNumber: id },
          { $set: { isActive: false, updatedAt: new Date().toISOString() } }
        );

      if (result.matchedCount === 0) {
        throw new Error("Customer not found");
      }

      return { status: "success", message: "Customer deleted successfully" };
    } catch (error: any) {
      console.error("Failed to delete customer:", error);
      throw new Error(`Failed to delete customer: ${error.message}`);
    }
  };

  // Decorate the fastify instance with the departmentService
  // @ts-ignore
  fastify.decorate("customersService", {
    getCustomers,
    getCustomersById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
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
      updateCustomer: (
        id: string,
        data: Partial<BodySchema>
      ) => Promise<{ status: string; message: string }>;
      deleteCustomer: (
        id: string
      ) => Promise<{ status: string; message: string }>;
    };
  }
}
