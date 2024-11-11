import fp from "fastify-plugin";

import { TResponse as getCompaniesSchema } from "./schema/getEntitySchema";
import {
  TResponse as createCompanyResponse,
  TBody as createEntityBody,
} from "./schema/createEntitiySchema";
import { decodeType } from "../../plugins/authenticate";

import {
  TResponse as updateEntityResponse,
  TBody as updateEntityBody,
} from "./schema/updateEntitySchema";
import { v4 } from "uuid";

export default fp(async (fastify) => {
  const getEntities = async (userInfo: decodeType) => {
    console.log(userInfo);
    const result = await fastify.mongo
      .collection("entities")
      .find({
        companyId: userInfo.companyId,
      })
      .toArray();

    return result;
  };

  const updateEntity = async (id: string, data: updateEntityBody) => {
    // update company with given keys and values
    const payload = {
      $set: {
        ...data,
        updatedAt: new Date().toISOString(),
      },
    };

    try {
      await fastify.mongo.collection("entities").updateOne({ id: id }, payload);

      return { status: "success", message: "inserted successfully" };
    } catch (error: any) {
      console.error("Failed to update company:", error);
      return { message: "Failed to update company: " + error.message };
    }
  };
  const createEntity = async (userInfo: decodeType, data: createEntityBody) => {
    const payload = {
      id: v4(),
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
      return { message: "Failed to insert company: " + error.message };
    }
  };

  // Decorate the fastify instance with the departmentService
  // @ts-ignore
  fastify.decorate("entityService", {
    getEntities,
    createEntity,
    updateEntity,
  });
});

declare module "fastify" {
  interface FastifyInstance {
    entityService: {
      getEntities: (userInfo: decodeType) => Promise<getCompaniesSchema | null>;
      updateEntity: (
        id: string,
        data: updateEntityBody
      ) => Promise<updateEntityResponse | null>;
      createEntity: (
        userInfo: decodeType,
        data: createEntityBody
      ) => Promise<createCompanyResponse | null>;
    };
  }
}
