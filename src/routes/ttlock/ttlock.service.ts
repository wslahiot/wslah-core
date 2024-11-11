import fp from "fastify-plugin";

import {
  TResponse as ttlockLockUnlockBody,
  TBody as unlockLockBody,
} from "./schema/unlockSchema";
import axios from "axios";
export default fp(async (fastify) => {
  const lock = async (data: string) => {
    try {
      const { clientId, accessToken, currentDate } =
        await fastify.contentBuilder();

      const content =
        clientId + "&" + accessToken + "&lockId=" + data + "&&" + currentDate;

      const response = await axios({
        method: "post",
        url: `https://euapi.ttlock.com/v3/lock/lock`,
        data: content,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (response.data?.errcode == 0) {
        return { status: 1, message: "success" };
      } else {
        return { status: 0, message: response.data.errmsg };
      }
    } catch (error: any) {
      console.error("Failed to insert unit:", error);
      return { status: 0, message: "Failed to insert unit: " + error.message };
    }
  };

  const unlock = async (data: string) => {
    try {
      const { clientId, accessToken, currentDate } =
        await fastify.contentBuilder();

      const content =
        clientId + "&" + accessToken + "&lockId=" + data + "&&" + currentDate;

      const response = await axios({
        method: "post",
        url: `https://euapi.ttlock.com/v3/lock/unlock`,
        data: content,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (response.data?.errcode == 0) {
        return { status: 1, message: "success" };
      } else {
        return { status: 0, message: response.data.errmsg };
      }
    } catch (error: any) {
      console.error("Failed to insert unit:", error);
      return { status: 0, message: "Failed to insert unit: " + error.message };
    }
  };

  const sync = async (data: string) => {
    const device = await fastify.mongo.collection("devices").findOne({
      deviceId: data,
    });

    console.log({ device });
    if (!device) {
      return { status: "failed", message: "Device not found" };
    }
    const { clientId, accessToken, currentDate } =
      await fastify.contentBuilder();

    const content =
      clientId + "&" + accessToken + "&lockId=" + data + "&&" + currentDate;

    try {
      const [lockInfo, lockOpeningState] = await Promise.all([
        axios({
          method: "get",
          url: `https://euapi.ttlock.com/v3/lock/detail?${content}`,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }),

        axios({
          method: "get",
          url: `https://euapi.ttlock.com/v3/lock/queryOpenState?${content}`,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }),
      ]);

      console.log({
        lockInfo: lockInfo.data,
        lockOpeningState: lockOpeningState.data,
      });

      if (lockInfo?.data?.errcode || lockOpeningState?.data?.errcode) {
        return { status: "failed", message: "error" };
      }

      await fastify.mongo.collection("devices").updateOne(
        {
          deviceId: data,
        },
        {
          $set: {
            extraInfo: lockInfo.data,
            isSync: true,
            isConnectedToNetwork: true,
            status: lockOpeningState.data.lockStatus,
            updatedAt: new Date().toISOString(),
          },
        }
      );
      return { status: "success", message: "Synced" };
    } catch (error: any) {
      console.error("Failed to insert unit:", error);
      return {
        status: "failed",
        message: "Failed to insert unit: " + error.message,
      };
    }
  };

  // Decorate the fastify instance with the departmentService
  // @ts-ignore
  fastify.decorate("ttlockService", {
    lock,
    unlock,
    sync,
  });
});

declare module "fastify" {
  interface FastifyInstance {
    ttlockService: {
      lock: (data: unlockLockBody) => Promise<ttlockLockUnlockBody | null>;
      sync: (data: string) => Promise<any | null>;
      unlock: (data: unlockLockBody) => Promise<ttlockLockUnlockBody | null>;
    };
  }
}
