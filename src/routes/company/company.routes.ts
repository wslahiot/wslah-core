import { FastifyRequest } from "fastify";
import { createCompanySchema } from "./schema/createCompanySchema";
import { getCompanySchema } from "./schema/getCompaniesSchema";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { updateCompanySchema } from "./schema/updateCompanySchema";

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

  fastify.route({
    method: "PUT",
    url: "/:id",
    schema: updateCompanySchema,
    preHandler: [fastify.authenticate],
    handler: async (request: FastifyRequest) => {
      const { id } = request.params as { id: string };
      const { body } = request;

      return await fastify.companyService.updateCompany(id, body);
    },
  });
};

export default company;
