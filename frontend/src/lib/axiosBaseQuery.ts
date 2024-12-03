import { apiClient } from "./";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig, AxiosError } from "axios";

const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: "" }
  ): BaseQueryFn<
    {
      url: AxiosRequestConfig["url"];
      method: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
      paramsSerializer?: AxiosRequestConfig["paramsSerializer"];
      responseType?: AxiosRequestConfig["responseType"];
    } & Pick<AxiosRequestConfig, "maxRedirects">,
    unknown,
    { status?: number; data: any }
  > =>
  async (
    { url, method, data, params, headers, paramsSerializer, responseType },
    { signal }
  ) => {
    try {
      const res = await apiClient({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
        signal,
        paramsSerializer,
        responseType,
      });
      return { data: res.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;

      //console.log("axiosError > ", axiosError);

      return {
        error: {
          code: err.code,
          status: err.response?.status,
          data: err.response?.data,
        },
      };
    }
  };

export default axiosBaseQuery;
