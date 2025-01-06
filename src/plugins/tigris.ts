import fp from "fastify-plugin";
import { S3Client } from "@aws-sdk/client-s3";

export interface TigrisS3PluginOptions {
  bucketName?: string; // Optional bucket override during plugin registration
}

export default fp<TigrisS3PluginOptions>(async (fastify, opts) => {
  // Validate environment variables
  if (
    !process.env.AWS_ACCESS_KEY_ID ||
    !process.env.AWS_SECRET_ACCESS_KEY ||
    !process.env.AWS_ENDPOINT_URL_S3
  ) {
    throw new Error(
      "Missing required AWS S3 environment variables: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_ENDPOINT_URL_S3"
    );
  }

  // Initialize the S3 client
  const s3Client = new S3Client({
    region: process.env.AWS_REGION || "auto",
    endpoint: process.env.AWS_ENDPOINT_URL_S3,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true, // Required for Tigris S3
  });

  // Bucket name can be overridden via plugin options
  const bucketName =
    opts.bucketName || process.env.BUCKET_NAME || "wslah-bucket";

  // Log successful initialization
  fastify.log.info(`✅ S3 client initialized with bucket: ${bucketName}`);

  // Decorate fastify instance with the S3 client and bucket name
  fastify.decorate("s3", {
    client: s3Client,
    bucketName,
  });

  // Graceful shutdown
  fastify.addHook("onClose", (instance, done) => {
    s3Client.destroy();
    fastify.log.info("🛑 S3 client destroyed");
    done();
  });
});

// Extend Fastify type definitions
declare module "fastify" {
  interface FastifyInstance {
    s3: {
      client: S3Client;
      bucketName: string;
    };
  }
}
