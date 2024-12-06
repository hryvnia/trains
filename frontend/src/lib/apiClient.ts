import { notifications } from "@mantine/notifications";
import axios, { InternalAxiosRequestConfig, isAxiosError } from "axios";
import { getSession } from "next-auth/react";

import get from "lodash/get";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

instance.interceptors.request.use(async (request) => {
  const session = await getSession();
  if (session) {
    const token = session.user.token;

    request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
});

instance.interceptors.response.use(
  (response) => {
    console.log(
      `response`,
      response.request.responseURL,
      response.config.responseType === "blob" ? null : response.data
    );
    return response;
  },
  (error) => {
    console.log(`api error > `, error);

    if (isAxiosError(error)) {
      notifications.show({
        color: "red",
        title: error.code,
        message: get(error, "response.data.message") || "",
      });
    }

    throw error;
  }
);

export default instance;
