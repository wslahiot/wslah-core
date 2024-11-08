import fp from "fastify-plugin";

import { TResponse as getCompaniesSchema } from "./schema/getCompaniesSchema";
import {
  TResponse as createCompanyResponse,
  TBody as createCompanyBody,
} from "./schema/createCompanySchema";

import {
  TResponse as updateCompanyResponse,
  TBody as updateCompanyBody,
} from "./schema/updateCompanySchema";

import { v4 } from "uuid";

export default fp(async (fastify) => {
  const getCompanies = async () => {
    const result = await fastify.mongo.collection("companies").find().toArray();

    return result;
  };

  const createCompany = async (data: createCompanyBody) => {
    const payload = {
      id: v4(),
      name: data.name,
      region: data.region,
      logo: data.logo,
      address: data.address,
      phoneNumber: data.phoneNumber,
      email: data.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await fastify.mongo.collection("companies").insertOne(payload);
      return { message: "inserted successfully" };
    } catch (error: any) {
      console.error("Failed to insert company:", error);
      throw new Error("Failed to insert company: " + error.message);
    }
  };

  const updateCompany = async (id: string, data: updateCompanyBody) => {
    // update company with given keys and values
    const payload = {
      $set: {
        ...data,
        updatedAt: new Date().toISOString(),
      },
    };

    try {
      await fastify.mongo.collection("companies").updateOne({ id }, payload);

      return { message: "updated successfully" };
    } catch (error: any) {
      console.error("Failed to update company:", error);
      throw new Error("Failed to update company: " + error.message);
    }
  };

  // Decorate the fastify instance with the departmentService
  // @ts-ignore
  fastify.decorate("companyService", {
    getCompanies,
    createCompany,
    updateCompany,
  });
});

declare module "fastify" {
  interface FastifyInstance {
    companyService: {
      getCompanies: () => Promise<getCompaniesSchema | null>;
      updateCompany: (
        id: string,
        data: updateCompanyBody
      ) => Promise<updateCompanyResponse | null>;
      createCompany: (
        data: createCompanyBody
      ) => Promise<createCompanyResponse | null>;
    };
  }
}
