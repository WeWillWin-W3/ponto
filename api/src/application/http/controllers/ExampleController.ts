import { Controller, deleteA, get, post } from "src/application/entities/Controller";
import { clientError, ok } from "src/application/entities/HttpResponse";
import { ExampleRepository } from "src/core/data-providers/ExampleRepository";
import { Example } from "src/core/entities/Example";

/*
@Controller('example')
class ExampleController {
  @Post()
  create() {
    return "Creating"
  }

  @Get('/:id')
  getOne(@Param('id') id) {
    return `Getting ${id}`
  }
}
*/

export const ExampleController = (
  exampleRepository: ExampleRepository
): Controller<Example> => ({
  create: post('', async () => ok("Creating")),
  getOne: get('/:id', async request => ok(`Getting ${request.params.id}`)),
  delete: deleteA('/:id', async request => {
    const { id } = request.params

    try {
      await exampleRepository.delete(id)
      return ok(`${id} deleted`)
    } catch (err) {
      return clientError(err)
    }
  })
})
  