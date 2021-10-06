import { HttpResponse } from "./HttpResponse";

export interface Middleware<T = any, U = any> {
    (httpRequest: T, httpBody?: U): Promise<HttpResponse | false>
  }
  