import fp from "fastify-plugin";
import axios from "axios";
import { TBody as SendSmsBody } from "./schema/sendSmsSchema";
import { TBody as CreateOtpBody } from "./schema/createOtpSchema";
import { TBody as VerifyOtpBody } from "./schema/verifyOtpSchema";

const MSEGAT_BASE_URL = "https://www.msegat.com/gw";
const HEADERS = { "Content-Type": "application/json" };

export default fp(async (fastify) => {
  const makeRequest = async <T>(endpoint: string, data: any) => {
    try {
      const response = await axios.post<T>(
        `${MSEGAT_BASE_URL}/${endpoint}`,
        data,
        { headers: HEADERS }
      );

      if (response.status === 200) {
        return {
          status: "success",
          data: response.data,
        };
      }
    } catch (error: any) {
      console.error(`Error in ${endpoint}:`, error);
      return {
        status: "failed",
        message: error.message,
      };
    }

    return {
      status: "failed",
      message: "Unknown error occurred",
    };
  };

  const sendSms = async (data: SendSmsBody) => {
    return await makeRequest("sendsms.php", data);
  };

  const createOtp = async (data: CreateOtpBody) => {
    return await makeRequest("sendOTPCode.php", data);
  };

  const verifyOtp = async (data: VerifyOtpBody) => {
    return await makeRequest("verifyOTPCode.php", data);
  };

  fastify.decorate("messagesService", {
    sendSms,
    createOtp,
    verifyOtp,
  });
});

declare module "fastify" {
  interface FastifyInstance {
    messagesService: {
      sendSms: (data: SendSmsBody) => Promise<any>;
      createOtp: (data: CreateOtpBody) => Promise<any>;
      verifyOtp: (data: VerifyOtpBody) => Promise<any>;
    };
  }
}
