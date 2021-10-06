import { Module } from '@nestjs/common';
import { NestControllerAdapter } from 'src/framework/http/adapters/NestControllerAdapter';
import { ExampleControllerFactory } from '../../factories/controllers/ExampleControllerFactory';

const NestGenericController = NestControllerAdapter(ExampleControllerFactory(), 'example')

@Module({
  imports: [],
  controllers: [NestGenericController],
})
export class ExampleModule {}

