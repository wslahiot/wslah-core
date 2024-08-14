import fp from "fastify-plugin";

import { TResponse as getCompaniesSchema } from "./schema/getEntitySchema";
import {
  TResponse as createCompanyResponse,
  TBody as createEntityBody,
} from "./schema/createEntitiySchema";

export default fp(async (fastify) => {
  const getEntities = async () => {
    const result = await fastify.mongo.collection("entities").find().toArray();

    return result;
  };

  const createEntity = async (data: createEntityBody) => {
    console.log(data); // Ensure sensitive data is handled securely in production

    const payload = {
      companyId: data.companyId,
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
      console.log("Insert successful:", result);
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
      getEntities: () => Promise<getCompaniesSchema | null>;
      createEntity: (
        data: createEntityBody
      ) => Promise<createCompanyResponse | null>;
    };
  }
}
