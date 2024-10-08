import axios from "axios";
import { AXIOS_DEFAULT_CONFIG } from "config/index";

import {
  requestSuccessFunc,
  requestFailFunc,
  responseSuccessFunc,
  responseFailFunc,
} from "config/interceptors/axios";

// 创建axios实例
const axiosInstance = axios.create(AXIOS_DEFAULT_CONFIG);

// 注入请求拦截
axiosInstance.interceptors.request.use(requestSuccessFunc, requestFailFunc);
// 注入失败拦截
axiosInstance.interceptors.response.use(responseSuccessFunc, responseFailFunc);

export default axiosInstance;
