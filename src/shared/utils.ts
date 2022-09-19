import { Header, RequestData, ResponseData } from "./types";
import { Request, Response } from "node-fetch";

/** Converts a `Request` instance into a plain JavaScript object. */
export async function objectifyRequest(request: Request): Promise<RequestData> {

  const headers: Header[] = [];
  request.headers.forEach((value, name) => headers.push({ name, value }));

  return {
    method: request.method,
    url: request.url,
    headers,
    body: await request.text()
  };
}

/** Converts a `Response` instance into a plain JavaScript object. */
export async function objectifyResponse(response: Response): Promise<ResponseData> {

  const headers: Header[] = [];
  response.headers.forEach((value, name) => headers.push({ name, value }));

  return {
    url: response.url,
    status: response.status,
    statusText: response.statusText,
    headers,
    body: await response.text(),
  };
}
