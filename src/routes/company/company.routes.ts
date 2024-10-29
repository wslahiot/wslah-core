import { FastifyRequest } from "fastify";
import { createCompanySchema } from "./schema/createCompanySchema";
import { getCompanySchema } from "./schema/getCompaniesSchema";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

const company: FastifyPluginAsyncTypebox = async (
  fastify: any
): Promise<void> => {
  // api to get specific user
  fastify.route({
    method: "GET",
    url: "/",
    schema: getCompanySchema,
    preHandler: [fastify.authenticate],
    handler: async () => {
      return await fastify.companyService.getCompanies();
    },
  });

  fastify.route({
    method: "POST",
    url: "/",
    schema: createCompanySchema,
    preHandler: [fastify.authenticate],
    handler: async (request: FastifyRequest) => {
      const { body } = request;
      return await fastify.companyService.createCompany(body);
    },
  });
};

export default company;
