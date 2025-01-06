import fp from "fastify-plugin";
import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 } from "uuid";

export default fp(async (fastify) => {
  const uploadFile = async (
    entity: string,
    companyId: string,
    file: Buffer,
    mimetype: string
  ) => {
    const fileId = v4();
    const key = `${entity}/${fileId}`;

    const command = new PutObjectCommand({
      Bucket: fastify.s3.bucketName,
      Key: key,
      Body: file,
      ContentType: mimetype,
    });

    await fastify.s3.client.send(command);
    return { fileId, key };
  };

  const getFileUrl = async (
    entity: string,
    companyId: string,
    fileId: string
  ) => {
    const key = `${entity}/${fileId}`;
    const command = new GetObjectCommand({
      Bucket: fastify.s3.bucketName,
      Key: key,
    });

    const url = await getSignedUrl(fastify.s3.client, command, {
      expiresIn: 3600,
    });
    return url;
  };

  const deleteFile = async (
    entity: string,
    companyId: string,
    fileId: string
  ) => {
    const key = `${entity}/${companyId}/${fileId}`;
    const command = new DeleteObjectCommand({
      Bucket: fastify.s3.bucketName,
      Key: key,
    });

    await fastify.s3.client.send(command);
    return { success: true, fileId };
  };

  const listFiles = async (entity: string, companyId: string) => {
    const command = new ListObjectsCommand({
      Bucket: fastify.s3.bucketName,
      Prefix: `${entity}/${companyId}/`,
    });

    const response = await fastify.s3.client.send(command);
    return (
      response.Contents?.map((file) => ({
        fileId: file.Key?.split("/")[2],
        key: file.Key,
        size: file.Size,
        lastModified: file.LastModified,
      })) || []
    );
  };

  fastify.decorate("uploadService", {
    uploadFile,
    getFileUrl,
    deleteFile,
    listFiles,
  } as any);
});

declare module "fastify" {
  interface FastifyInstance {
    uploadService: {
      uploadFile: (
        entity: string,
        companyId: string,
        file: Buffer,
        mimetype: string
      ) => Promise<{ fileId: string; key: string }>;
      getFileUrl: (
        entity: string,
        companyId: string,
        fileId: string
      ) => Promise<string>;
      deleteFile: (
        entity: string,
        companyId: string,
        fileId: string
      ) => Promise<{ success: boolean; fileId: string }>;
      listFiles: (
        entity: string,
        companyId: string
      ) => Promise<
        Array<{
          fileId: string;
          key: string;
          size?: number;
          lastModified?: Date;
        }>
      >;
    };
  }
}
