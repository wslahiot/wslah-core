import fp from "fastify-plugin";

import {
  TResponse as ttlockLockUnlockBody,
  TBody as unlockLockBody,
} from "./schema/unlockSchema";

import {
  TResponse as passcodeResponse,
  TBody as passcodeBody,
} from "./schema/createPasscode";
import axios from "axios";
import momentTimeZone from "moment-timezone";
import moment from "moment";
export default fp(async (fastify) => {
  const lock = async (data: string) => {
    try {
      const { clientId, accessToken, currentDate } =
        await fastify.contentBuilder();

      const content =
        clientId + "&" + accessToken + "&lockId=" + data + "&&" + currentDate;

      const response = await axios({
        method: "POST",
        url: `https://euapi.ttlock.com/v3/lock/lock`,
        data: content,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (response.data?.errcode == 0) {
        return { status: "success", message: "success" };
      } else {
        return { status: "success", message: response.data.errmsg };
      }
    } catch (error: any) {
      console.error("Failed to insert unit:", error);
      return {
        status: "failed",
        message: "Failed to insert unit: " + error.message,
      };
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
      console.log({ response: response.data });
      if (response.data?.errcode == 0) {
        return { status: "success", message: "success" };
      } else {
        return { status: "failed", message: response.data.errmsg };
      }
    } catch (error: any) {
      console.error("Failed to insert unit:", error);
      return {
        status: "failed",
        message: "Failed to insert unit: " + error.message,
      };
    }
  };
  const getOpenState = async (data: string) => {
    try {
      const { clientId, accessToken, currentDate } =
        await fastify.contentBuilder();

      const content =
        clientId + "&" + accessToken + "&lockId=" + data + "&&" + currentDate;

      const response = await axios({
        method: "POST",
        url: `https://euapi.ttlock.com/v3/lock/queryOpenState`,
        data: content,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (response.data?.errcode == 0) {
        return {
          status: "success",
          openStatus: response?.data?.lockStatus || 0,
        };
      } else {
        return { status: "failed", message: response.data.errcode };
      }
    } catch (error: any) {
      console.error("Failed to insert unit:", error);
      return {
        status: "failed",
        message: "Failed to insert unit: " + error.message,
      };
    }
  };
  const sync = async (data: string, withState: boolean = true) => {
    const device = await fastify.mongo.collection("devices").findOne({
      deviceId: data,
    });

    if (!device) {
      return { status: "failed", message: "Device not found" };
    }
    const { clientId, accessToken, currentDate } =
      await fastify.contentBuilder();

    const content =
      clientId + "&" + accessToken + "&lockId=" + data + "&&" + currentDate;

    try {
      const lockInfoPromise = axios({
        method: "get",
        url: `https://euapi.ttlock.com/v3/lock/detail?${content}`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const lockOpeningStatePromise = withState
        ? getOpenState(data)
        : Promise.resolve(null);

      const [lockInfo, lockOpeningState] = await Promise.all([
        lockInfoPromise,
        lockOpeningStatePromise,
      ]);
      if (lockInfo.data?.errcode !== 0) {
        return { status: "failed", message: "Not synced" };
      }
      const updateData: any = {
        extraInfo: lockInfo.data,
        isSync: true,
        isConnectedToNetwork: !!lockInfo.data?.lockData?.hasGateway,
        updatedAt: new Date().toISOString(),
      };

      if (withState && lockOpeningState) {
        updateData.status = lockOpeningState.openStatus;
      }

      await fastify.mongo.collection("devices").updateOne(
        {
          deviceId: data,
        },
        {
          $set: updateData,
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

  const getPasscodes = async (data: string) => {
    try {
      const { accessToken, currentDate } = await fastify.contentBuilder();

      const content =
        `clientId=${process.env.TTLOCK_CLIENT_ID}&` +
        accessToken +
        "lockId=" +
        data +
        "&" +
        "pageNo=1&pageSize=20&" +
        currentDate;

      const response = await axios({
        method: "GET",
        url: `https://euapi.ttlock.com/v3/lock/listKeyboardPwd?${content}`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (response.data) {
        return {
          status: "success",
          result: response.data.list.map((item: any) => ({
            passcode: item.keyboardPwd,
            passcodeName: item.keyboardPwdName,
            startDate: item.endDate
              ? moment(item.startDate).format("YYYY-MM-DD HH:mm:ss")
              : "",
            endDate: item.endDate
              ? moment(item.endDate).format("YYYY-MM-DD HH:mm:ss")
              : "",
          })),
        };
      } else {
        return { status: "failed", message: response.data.errmsg };
      }
    } catch (error: any) {
      console.error("Failed to insert unit:", error);
      return {
        status: "failed",
        message: "Failed to get  " + error.message,
      };
    }
  };

  const generatePasscode = async (data: passcodeBody) => {
    const { lockId, passcode, passcodeName, startDate, endDate } = data;
    console.log({ data });
    try {
      const { accessToken, currentDate } = await fastify.contentBuilder();

      let content = `clientId=${process.env.TTLOCK_CLIENT_ID}&${accessToken}&lockId=${lockId}&keyboardPwd=${passcode}&keyboardPwdName=${passcodeName}&addType=2&${currentDate}`;

      // If the passcode is for a specific period, add the start and end date
      if (startDate && endDate) {
        const startPeriod = momentTimeZone
          .tz(startDate, "YYYY-MM-DD HH:mm:ss", "Asia/Riyadh")
          .valueOf();
        const endPeriod = momentTimeZone
          .tz(endDate, "YYYY-MM-DD HH:mm:ss", "Asia/Riyadh")
          .valueOf();
        content += `&startDate=${startPeriod}&endDate=${endPeriod}`;
      }
      console.log({ content });
      const response = await axios({
        method: "post",
        url: `https://euapi.ttlock.com/v3/keyboardPwd/add`,
        data: content,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      console.log({ response: response.data });
      if (response.data?.errcode === 0) {
        return {
          status: "success",
          message: "Passcode generated successfully",
        };
      } else {
        return {
          status: "failed",
          message: response.data.errmsg || "Failed to generate passcode",
        };
      }
    } catch (error: any) {
      console.error("Failed to generate passcode:", error);
      return {
        status: "failed",
        message: "Failed to generate passcode: " + error.message,
      };
    }
  };

  // Decorate the fastify instance with the departmentService
  // @ts-ignore
  fastify.decorate("ttlockService", {
    lock,
    unlock,
    sync,
    getOpenState,
    generatePasscode,
    getPasscodes,
  });
});

declare module "fastify" {
  interface FastifyInstance {
    ttlockService: {
      lock: (data: unlockLockBody) => Promise<ttlockLockUnlockBody | null>;
      sync: (data: string, withState?: boolean) => Promise<any | null>;
      unlock: (data: unlockLockBody) => Promise<ttlockLockUnlockBody | null>;
      getPasscodes: (data: string) => Promise<passcodeResponse | null>;
      getOpenState: (data: string) => Promise<any | null>;
      generatePasscode(data: passcodeBody): Promise<any>;
    };
  }
}
