import API from "plugins/api";
import type { AxiosRequestConfig } from "axios";
// 这里约定所有的接口方法名前加个“$”前缀，跟普通方法名区分开

// 【本地接口】获取本地信息
export interface GetLocalInfoDTO {
  query: string;
}

export interface GetLocalInfoResultDTO {
  result: string;
  data: string;
}
export async function $getLocalInfo(
  data?: GetLocalInfoDTO,
  options: AxiosRequestConfig = {},
) {
  return API({
    isLocal: true, // 本地接口时  isLocal必须为true，否则闪退！
    url: "/api/local/info",
    method: "GET",
    data,
    ...options,
  });
}

// 【其他项目接口】获取其他项目信息
export interface GetAnotherInfoDTO {
  query: string;
}

export interface GetAnotherInfoResultDTO {
  result: string;
  data: string;
}
export async function $getAnotherInfo(
  data?: GetAnotherInfoDTO,
  options: AxiosRequestConfig = {},
) {
  return API({
    url: "/api/info",
    method: "GET",
    data,
    ...options,
  });
}
