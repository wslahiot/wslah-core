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
import { TResponse as GetCompanyByIdResponse } from "./schema/getCompanyByIdSchema";
import { TResponse as DeleteCompanyResponse } from "./schema/deleteCompanySchema";

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
      return { status: "success", message: "inserted successfully" };
    } catch (error: any) {
      console.error("Failed to insert company:", error);
      return { message: "Failed to insert company: " + error.message };
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
      return { message: "Failed to update company: " + error.message };
    }
  };

  const getCompanyById = async (id: string) => {
    try {
      const result = await fastify.mongo
        .collection("companies")
        .findOne({ id });

      if (!result) {
        throw new Error("Company not found");
      }

      return result;
    } catch (error: any) {
      console.error("Failed to get company:", error);
      throw new Error(`Failed to get company: ${error.message}`);
    }
  };

  const deleteCompany = async (id: string) => {
    try {
      const result = await fastify.mongo
        .collection("companies")
        .updateOne(
          { id },
          { $set: { isActive: false, updatedAt: new Date().toISOString() } }
        );

      if (result.matchedCount === 0) {
        throw new Error("Company not found");
      }

      return { status: "success", message: "Company deleted successfully" };
    } catch (error: any) {
      console.error("Failed to delete company:", error);
      throw new Error(`Failed to delete company: ${error.message}`);
    }
  };

  // Decorate the fastify instance with the departmentService
  // @ts-ignore
  fastify.decorate("companyService", {
    getCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
    deleteCompany,
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
      getCompanyById: (id: string) => Promise<GetCompanyByIdResponse | null>;
      deleteCompany: (id: string) => Promise<DeleteCompanyResponse | null>;
    };
  }
}
