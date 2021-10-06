import { HttpMethod, HttpRequest } from "./HttpRequest";
import { HttpResponse } from "./HttpResponse";

export interface ControllerAction<T> {
    (request: HttpRequest<T>): Promise<HttpResponse>
}

export interface ControllerActionInfo<T> {
    action: ControllerAction<T> 
    path?: string
    method: HttpMethod
}

const _action = (method: HttpMethod) => <T>(
    path: string,
    action: ControllerAction<T>,
): ControllerActionInfo<T> => ({
    method,
    path,
    action
})

export const get = _action("GET")
export const head = _action("HEAD")
export const post = _action("POST")
export const put = _action("PUT")
export const deleteA = _action("DELETE")
export const options = _action("OPTIONS")
export const patch = _action("PATCH")

export interface Controller<T> {
    [actionName: string]: ControllerActionInfo<T>
}