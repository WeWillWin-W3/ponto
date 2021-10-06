import { Controller as DomainController, ControllerAction } from "src/application/entities/Controller";
import { Request, Response, Router } from "express";
import { PartialRecord } from "src/application/entities/util";

export function ExpressRouteHandlerFromAction<T>(action: ControllerAction<T>) {
    return async (request: Request, response: Response) => {
        const requestData = {
          body: request.body,
          params: request.params as PartialRecord<keyof T, string>,
          query: request.query as PartialRecord<keyof T, string>,
          headers: request.headers
        }
    
        const httpResponse = await action(requestData)
    
        if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
          return response.status(httpResponse.statusCode).json(httpResponse.body)
        } else {
          return response.status(httpResponse.statusCode).json({
            error: httpResponse.body.error,
          })
        }
    }
}

export function ExpressControllerAdapter<T>(controller: DomainController<T>) {
    const router = Router()

    Object.values(controller).forEach(actionInfo => {
        const { path, action } = actionInfo
        const method = actionInfo.method.toLowerCase()

        router[method](path, ExpressRouteHandlerFromAction(action))
    })

    return router
}