import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { FastifyRequest } from "fastify";
// import { uploadFileSchema } from "./schema/uploadFileSchema";
import { getFileSchema } from "./schema/getFileSchema";
import { listFilesSchema } from "./schema/listFilesSchema";
import { deleteFileSchema } from "./schema/deleteFileSchema";

const upload: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
  /**
   * File Upload Route
   */
  fastify.route({
    method: "POST",
    url: "/:entity",
    preHandler: fastify.authenticate,
    handler: async (request: FastifyRequest, reply) => {
      console.log("🚀 uploadFile Route Called");
      const { entity } = request.params as { entity: string };
      const decoded = fastify.decode(request.headers.authorization as string);
      try {
        const data = await request.file();

        if (!data) {
          return reply.code(400).send({ error: "No file uploaded" });
        }

        const { mimetype, filename } = data;
        const buffer = await data.toBuffer();

        console.log("📦 File Details:", {
          filename,
          mimetype,
          size: buffer.length,
        });

        const result = await fastify.uploadService.uploadFile(
          entity,
          decoded.companyId,
          buffer,
          mimetype
        );

        return reply.code(200).send({
          fileId: result.fileId,
          key: result.key,
        });
      } catch (error) {
        console.error("❌ Upload failed:", error);
        return reply.code(500).send({
          error: "File upload failed",
          details: (error as Error).message,
        });
      }
    },
  });

  /**
   * Get File URL
   */
  fastify.route({
    method: "GET",
    url: "/:entity/files/:fileId",
    schema: getFileSchema,
    // preHandler: fastify.authenticate,
    handler: async (request: FastifyRequest) => {
      const { entity, fileId } = request.params as {
        entity: string;
        fileId: string;
      };
      const decoded = fastify.decode(request.headers.authorization as string);
      return await fastify.uploadService.getFileUrl(
        entity,
        decoded.companyId,
        fileId
      );
    },
  });

  /**
   * Delete File
   */
  fastify.route({
    method: "DELETE",
    url: "/:entity/files/:fileId",
    schema: deleteFileSchema,
    preHandler: fastify.authenticate,
    handler: async (request: FastifyRequest) => {
      const { entity, fileId } = request.params as {
        entity: string;
        fileId: string;
      };
      const decoded = fastify.decode(request.headers.authorization as string);
      return await fastify.uploadService.deleteFile(
        entity,
        decoded.companyId,
        fileId
      );
    },
  });

  /**
   * List Files
   */
  fastify.route({
    method: "GET",
    url: "/:entity/files",
    schema: listFilesSchema,
    preHandler: fastify.authenticate,
    handler: async (request: FastifyRequest) => {
      const { entity } = request.params as { entity: string };
      const decoded = fastify.decode(request.headers.authorization as string);
      return await fastify.uploadService.listFiles(entity, decoded.companyId);
    },
  });
};

export default upload;
