import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const REQ_TIMEOUT = 15 * 1000;

const instance = axios.create({
  baseURL: "http://localhost:4000/",
  timeout: REQ_TIMEOUT,
});

instance.interceptors.request.use((_config) => requestHandler(_config));

const requestHandler = (request) => {
  // if (__DEV__) {
  console.log(
    `Request API - ${request.method?.toUpperCase()}: ${request.url}`,
    // request.params,
    request.data
  );
  // }
  return request;
};

instance.interceptors.response.use(
  (response) => successHandler(response),
  (error) => errorHandler(error)
);

const errorHandler = (error) => {
  // if (__DEV__) {
  console.log(error);
  // }
  return Promise.reject({ ...error });
};

const successHandler = (response) => {
  // if (__DEV__) {
  console.log(`Response API: ${response.config.url}`, response.data);
  // }
  return response.data;
};

async function fetch(url, params, customHeaders = {}) {
  const headers = getHeader(customHeaders);
  return instance.get(url, { params, headers });
}

async function post(url, data, customHeaders = {}) {
  const headers = getHeader(customHeaders);
  return instance.post(url, { ...data }, { headers });
}

async function postForm(url, data, customHeaders = {}) {
  const headers = getHeader(customHeaders);
  return instance.post(url, data, { headers });
}

async function put(url, data, customHeaders = {}) {
  const headers = getHeader(customHeaders);
  return instance.put(url, { ...data }, { headers });
}

function getHeader(customHeaders = {}) {
  return {
    ...customHeaders,
  };
}

const ApiHelper = { fetch, post, put, postForm };
export default ApiHelper;
