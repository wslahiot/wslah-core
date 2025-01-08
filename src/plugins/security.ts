import fp from "fastify-plugin";
import crypto from "crypto";
import { FastifyInstance } from "fastify";

const secretKey = process.env.ENCRYPTION_KEY || "secret";

export const encryptPayload = async (payload: any) => {
  console.log("secretKey", secretKey, payload);
  const hash = crypto.createHash("sha256").update(secretKey).digest();

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-gcm", hash, iv);

  let encrypted = cipher.update(JSON.stringify(payload), "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return {
    encrypted,
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
  };
};

export const decryptPayload = async (encryptedData: {
  encrypted: string;
  iv: string;
  authTag: string;
}) => {
  const hash = crypto.createHash("sha256").update(secretKey).digest();

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    hash,
    Buffer.from(encryptedData.iv, "hex")
  );

  decipher.setAuthTag(Buffer.from(encryptedData.authTag, "hex"));

  let decrypted = decipher.update(encryptedData.encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return JSON.parse(decrypted);
};

export default fp<FastifyInstance>(async (fastify) => {
  if (secretKey) {
    fastify.decorate("encryptPayload", async (payload: any) =>
      encryptPayload(payload)
    );
    fastify.decorate("decryptPayload", async (encryptedData: any) =>
      decryptPayload(encryptedData)
    );
  }
});

declare module "fastify" {
  interface FastifyInstance {
    encryptPayload: (payload: any) => Promise<any>;
    decryptPayload: (encryptedData: any) => Promise<any>;
  }
}
