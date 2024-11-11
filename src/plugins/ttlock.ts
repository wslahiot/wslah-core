import fp from "fastify-plugin";
import { md5 } from "js-md5";
import axios from "axios";
import { FastifyInstance } from "fastify";

export interface TtlockTokenPluginOptions {
  // Specify support plugin options here.
}

export interface Token {
  access_token: string;
  uid: number;
  refresh_token: string;
  expires_in: number;
}

interface ContentBuilderSchema {
  clientId: string;
  accessToken: string;
  currentDate: string;
  // lockId: string;
}

export default fp<TtlockTokenPluginOptions>(
  async (fastify: FastifyInstance, opts) => {
    let token: Token | null = null; // Variable to hold the token object
    let expirationTime: number | null = null; // Variable to hold the expiration time of the token

    fastify.decorate("generateToken", async (): Promise<any> => {
      const TTLOCK_PASSWORD = process.env.TTLOCK_PASSWORD;

      if (!TTLOCK_PASSWORD) {
        return Promise.reject(new Error("No TTLock password provided."));
      }

      const hash = md5.create();
      hash.update(TTLOCK_PASSWORD);
      const hashedPassword = hash.hex();

      const content = `clientId=${process.env.TTLOCK_CLIENT_ID}&clientSecret=${process.env.TTLOCK_CLIENT_SECRET}&username=${process.env.TTLOCK_USERNAME}&password=${hashedPassword}`;

      try {
        const response = await axios({
          method: "post",
          url: "https://euapi.ttlock.com/oauth2/token",
          data: content,
        });

        // Store the token object and calculate the expiration time
        token = response.data as Token;
        expirationTime = Date.now() + token.expires_in * 1000; // expires_in is in seconds, so convert to milliseconds

        return token;
      } catch (error) {
        fastify.log.error(error);
      }
    });

    fastify.decorate("refreshToken", async (): Promise<any> => {
      if (!token || !token.refresh_token) {
        return Promise.reject(new Error("No refresh token available."));
      }

      const content = `clientId=${process.env.TTLOCK_CLIENT_ID}&clientSecret=${process.env.TTLOCK_CLIENT_SECRET}&refreshToken=${token.refresh_token}&grantType=refresh_token`;

      try {
        const response = await axios({
          method: "post",
          url: "https://euapi.ttlock.com/oauth2/token",
          data: content,
        });

        // Update the token and expiration time with the new data
        token = response.data as Token;
        expirationTime = Date.now() + token.expires_in * 1000;

        return token;
      } catch (error) {
        fastify.log.error(error);
      }
    });

    fastify.decorate("getToken", async (): Promise<Token> => {
      // Check if the token is valid or needs to be refreshed
      if (!token || Date.now() >= (expirationTime || 0)) {
        await fastify.refreshToken().catch(async () => {
          // If refreshing fails, generate a new token instead
          await fastify.generateToken();
        });
      }

      return token!;
    });

    fastify.decorate(
      "contentBuilder",
      async (): Promise<ContentBuilderSchema> => {
        const token = await fastify.getToken();
        return {
          clientId: `clientId=${process.env.TTLOCK_CLIENT_ID}&clientSecret=${process.env.TTLOCK_CLIENT_SECRET}&`,
          accessToken: `accessToken=${token.access_token}&`,
          currentDate: `date=${new Date().getTime()}`,
          // lockId: `lockId=${process.env.lockId}`,
        };
      }
    );
  }
);

// When using .decorate, you have to specify added properties for TypeScript
declare module "fastify" {
  interface FastifyInstance {
    generateToken(): Promise<Token>;
    getToken(): Promise<Token>;
    refreshToken(): Promise<Token>;
    contentBuilder(): Promise<ContentBuilderSchema>;
  }
}
