import { ExampleRepository } from '../../../core/data-providers/ExampleRepository';
import { Example } from '../../../core/entities/Example';

export class ExamplePrismaRepository
  implements ExampleRepository
{
  async delete(id: Example['id']) {
    return { id, someString: '', someNumber: 0 }
  }
}
