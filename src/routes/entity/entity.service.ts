import fp from "fastify-plugin";

import { TResponse as getCompaniesSchema } from "./schema/getEntitySchema";
import {
  TResponse as createCompanyResponse,
  TBody as createEntityBody,
} from "./schema/createEntitiySchema";
import { decodeType } from "../../plugins/authenticate";

export default fp(async (fastify) => {
  const getEntities = async (userInfo: decodeType) => {
    const result = await fastify.mongo
      .collection("entities")
      .find({
        companyId: userInfo.companyId,
      })
      .toArray();

    return result;
  };

  const createEntity = async (userInfo: decodeType, data: createEntityBody) => {
    const payload = {
      companyId: userInfo.companyId,
      name: data.name,
      lat: data.lat,
      lng: data.lng,
      description: data.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const result = await fastify.mongo
        .collection("entities")
        .insertOne(payload);

      return { id: result.insertedId };
    } catch (error: any) {
      console.error("Failed to insert company:", error);
      throw new Error("Failed to insert company: " + error.message);
    }
  };

  // Decorate the fastify instance with the departmentService
  // @ts-ignore
  fastify.decorate("entityService", {
    getEntities,
    createEntity,
  });
});

declare module "fastify" {
  interface FastifyInstance {
    entityService: {
      getEntities: (userInfo: decodeType) => Promise<getCompaniesSchema | null>;
      createEntity: (
        userInfo: decodeType,
        data: createEntityBody
      ) => Promise<createCompanyResponse | null>;
    };
  }
}
