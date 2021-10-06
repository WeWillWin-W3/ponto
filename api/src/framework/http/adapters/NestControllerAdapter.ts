import { Controller as ControllerDecorator, Delete, Get, Head, Options, Patch, Post, Put, Req, Res } from "@nestjs/common";
import { Type } from "@nestjs/common/interfaces";
import { Controller as DomainController, ControllerActionInfo } from "../../../application/entities/Controller";
import { ExpressRouteHandlerFromAction } from "./ExpressControllerAdapter";

type NestRouteHandlerDecorator = {
    (path?: string | string[]): MethodDecorator
}

const ControllerMethodToNestMethodDecorator: Record<ControllerActionInfo<any>['method'], NestRouteHandlerDecorator> = {
    'GET': Get,
    'DELETE': Delete,
    'PATCH': Patch,
    'POST': Post,
    'PUT': Put,
    'HEAD': Head,
    'OPTIONS': Options
}

export function NestControllerAdapter<T>(controller: DomainController<T>, path: string): Type<any> {
    class NestController {}

    Object.entries(controller).forEach(([actionName, actionInfo]) => {
        const { action, path='', method } = actionInfo 

        const decorator = ControllerMethodToNestMethodDecorator[method]

        const nestControllerAction = ExpressRouteHandlerFromAction(action)

        Req()(NestController.prototype, actionName, 0)
        Res()(NestController.prototype, actionName, 1)

        NestController.prototype[actionName] = nestControllerAction

        decorator(path)(NestController.prototype, actionName, { writable: true, enumerable: false, configurable: true, value: nestControllerAction })
    })

    ControllerDecorator(path)(NestController)

    return NestController
}