import fp from "fastify-plugin";

import { TResponse as getCompaniesSchema } from "./schema/getCompaniesSchema";
import {
  TResponse as createCompanyResponse,
  TBody as createCompanyBody,
} from "./schema/createCompanySchema";

export default fp(async (fastify) => {
  const getCompanies = async () => {
    const result = await fastify.mongo.collection("companies").find().toArray();

    return result;
  };

  const createCompany = async (data: createCompanyBody) => {
    console.log(data); // Ensure sensitive data is handled securely in production
    const payload = {
      name: data.name,
      region: data.region,
      logo: data.logo,
      address: data.address,
      phoneNumber: data.phoneNumber,
      email: data.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log(payload); // Ensure sensitive data is handled securely in production

    try {
      const result = await fastify.mongo
        .collection("companies")
        .insertOne(payload);
      console.log("Insert successful:", result);
      return { id: result.insertedId };
    } catch (error: any) {
      console.error("Failed to insert company:", error);
      throw new Error("Failed to insert company: " + error.message);
    }
  };

  // Decorate the fastify instance with the departmentService
  // @ts-ignore
  fastify.decorate("companyService", {
    getCompanies,
    createCompany,
  });
});

declare module "fastify" {
  interface FastifyInstance {
    companyService: {
      getCompanies: () => Promise<getCompaniesSchema | null>;
      createCompany: (
        data: createCompanyBody
      ) => Promise<createCompanyResponse | null>;
    };
  }
}
