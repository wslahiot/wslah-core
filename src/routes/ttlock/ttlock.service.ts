import fp from "fastify-plugin";

import {
  TResponse as ttlockLockUnlockBody,
  TBody as unlockLockBody,
} from "./schema/unlockSchema";
import axios from "axios";

export default fp(async (fastify) => {
  const lock = async (data: unlockLockBody) => {
    try {
      const { clientId, accessToken, currentDate } =
        await fastify.contentBuilder();

      const content = `${clientId}&${accessToken}&${data.id}&&${currentDate}`;
      const response = await axios({
        method: "post",
        url: `https://euapi.ttlock.com/v3/lock/lock`,
        data: content,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (response.data?.errcode == 0) {
        return { status: 1, message: response.data.errmsg };
      } else {
        return { status: 0, message: response.data.errmsg };
      }
    } catch (error: any) {
      console.error("Failed to insert unit:", error);
      throw new Error("Failed to insert unit: " + error.message);
    }
  };

  const unlockLock = async (data: unlockLockBody) => {
    try {
      const { clientId, accessToken, currentDate } =
        await fastify.contentBuilder();

      const content = `${clientId}&${accessToken}&${data.id}&&${currentDate}`;
      const response = await axios({
        method: "post",
        url: `https://euapi.ttlock.com/v3/lock/unlock`,
        data: content,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (response.data?.errcode == 0) {
        return { status: 1, message: response.data.errmsg };
      } else {
        return { status: 0, message: response.data.errmsg };
      }
    } catch (error: any) {
      console.error("Failed to insert unit:", error);
      throw new Error("Failed to insert unit: " + error.message);
    }
  };

  // Decorate the fastify instance with the departmentService
  // @ts-ignore
  fastify.decorate("ttlockService", {
    lock,
    unlockLock,
  });
});

declare module "fastify" {
  interface FastifyInstance {
    ttlockService: {
      lock: (data: unlockLockBody) => Promise<ttlockLockUnlockBody | null>;
      unlockLock: (
        data: unlockLockBody
      ) => Promise<ttlockLockUnlockBody | null>;
    };
  }
}
