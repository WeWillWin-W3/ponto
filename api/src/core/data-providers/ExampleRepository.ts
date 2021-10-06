import { Example } from '../entities/Example';

export interface ExampleRepository {
  delete(id: Example['id']): Promise<Example>;
}
