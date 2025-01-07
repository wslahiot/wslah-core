import { FastifyRequest } from "fastify";
import { createCompanySchema } from "./schema/createCompanySchema";
import { getCompanySchema } from "./schema/getCompaniesSchema";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { updateCompanySchema } from "./schema/updateCompanySchema";
import { getCompanyByIdSchema } from "./schema/getCompanyByIdSchema";
import { deleteCompanySchema } from "./schema/deleteCompanySchema";
import { getCompanyEntitiesAndUnitSchema } from "./schema/getCompanyEntitiesAndUnit";

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

  fastify.route({
    method: "DELETE",
    url: "/:id",
    schema: deleteCompanySchema,
    preHandler: [fastify.authenticate],
    handler: async (request: FastifyRequest) => {
      const { id } = request.params as { id: string };
      return await fastify.companyService.deleteCompany(id);
    },
  });

  fastify.route({
    method: "GET",
    url: "/:id",
    schema: getCompanyByIdSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: FastifyRequest) => {
      const { id } = request.params as { id: string };
      return await fastify.companyService.getCompanyById(id);
    },
  });

  //get all entityies and unit by company id
  fastify.route({
    method: "GET",
    url: "/:id/entitiesAndUnits",
    schema: getCompanyEntitiesAndUnitSchema,
    handler: async (request: FastifyRequest) => {
      const { id } = request.params as { id: string };
      return await fastify.companyService.getEntitiesAndUnitsByCompanyId(id);
    },
  });
};

export default company;
