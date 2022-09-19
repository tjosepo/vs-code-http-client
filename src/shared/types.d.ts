export interface RequestData {
  url: string;
  method: string;
  headers: Header[],
  body?: string;
}

export interface ResponseData {
  url: string,
  status: number;
  statusText: string;
  headers: Header[],
  body: string;
}

type Header = { name: string, value: string };

export type Method = "GET" | "POST";
