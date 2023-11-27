import type { AxiosResponse } from 'axios'

async function responseHandler<T>(response: Promise<AxiosResponse>): Promise<T> {
  return await response
    .then(({ data }) => Promise.resolve(data as T))
    .catch((e) => Promise.reject(e))
}

export default responseHandler
