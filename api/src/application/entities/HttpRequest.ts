import { PartialRecord } from "./util";

export type HttpMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'PATCH' 

export interface HttpRequest<T> {
  body: Partial<T>
  params: PartialRecord<keyof T, string>
  query: PartialRecord<keyof T, string>
  headers: Record<string, string | string[] | undefined>
}