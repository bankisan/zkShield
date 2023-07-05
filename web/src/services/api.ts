import { API_BASE_URL } from '../config';
import axios from 'axios';

// Temporary use for debugging on local network
axios.defaults.baseURL = API_BASE_URL;

const handleRes = (response:any, resolve:any) => {
  resolve(response)
}

const handleErr = (error:any, reject:any) => {
  if (!!error.response) {
    reject(error.response.data)
    return
  }
  // If there is an unexpected javascript error, handle it like a
  // backend server error message.
  reject({
    status: 500,
    errors: [
      {
        "message": error.message
      }
    ]
  })
}

const axDefaultRequest = (requestType:string, url:string, data?:object, options = {}) => {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    const req:any = axios[requestType]
    req(url, data, options)
      .then((response:any) => { handleRes(response, resolve) })
      .catch((error:any) => { handleErr(error, reject) });
  })
}

const axJsonRequest = (requestType:string, url:string, ...args:any[]) => {
  // Request method PUT, PATCH, or POST should have
  // a body parameter as the first argument in the args list
  // and the rest are the options.
  let options:any = {}
  if ((new Set(["put", "patch", "post"]).has(requestType))) {
    if (args.length > 2) {
      options = args.slice(1).reduce((obj:object, current:object) => ({ ...obj, ...current}), {})
    }
    if (args.length === 2) {
      options = args[args.length-1]
    }

    let body = args[0]
    return axDefaultRequest(requestType, url, body, options)
  }

  // A GET request with a query string should request with
  // a params key in the options.
  if (args.length > 1) {
    options = args.reduce((obj:object, current:object) => ({ ...obj, ...current}), {})
  }
  if (args.length === 1) {
    options = args[0]
  }

  return axDefaultRequest(requestType, url, options)
}

// Basic JSON API helper functions.
const get = axJsonRequest.bind(null, 'get')
const post = axJsonRequest.bind(null, 'post')
const patch = axJsonRequest.bind(null, 'patch')
const destroy = axJsonRequest.bind(null, 'delete')

// Auth api
export const getMe = get.bind(null, '/me')
