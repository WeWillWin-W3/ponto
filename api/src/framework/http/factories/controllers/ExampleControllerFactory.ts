import { Controller } from "src/application/entities/Controller";
import { ExampleController } from "src/application/http/controllers/ExampleController";
import { Example } from "src/core/entities/Example";
import { ExamplePrismaRepository } from "src/framework/data-providers/example/example.prisma.repository";

export function ExampleControllerFactory(): Controller<Example> {
    const repository = new ExamplePrismaRepository()
    
    return ExampleController(repository)
}