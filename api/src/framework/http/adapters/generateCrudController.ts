import { Body, Controller, Delete, Get, Inject, Param, Post, Put } from "@nestjs/common"
import { Type as NestType } from '@nestjs/common/interfaces'
import { PrismaGenericRepository } from "src/framework/data-providers/generic.prisma.repository"

interface DTOClassType<T> extends Function { new (): T }

type GenerateCrudController<T, C, U> = {
    route: string
    primaryKey: keyof T & string
    repositoryName: string
    CreateDto: DTOClassType<C>
    UpdateDto: DTOClassType<U>
}

export function generateCrudController<T, C, U>({
    route, 
    primaryKey, 
    repositoryName,
    CreateDto,
    UpdateDto
  }: GenerateCrudController<T, C, U>): NestType<any> {
    const primaryKeyRoute = `/:${primaryKey}`
  
    @Controller(route)
    class CrudController {
  
      constructor(
          @Inject(repositoryName) private genericRepository: PrismaGenericRepository<T>
      ) {}
  
      @Post()
      @Reflect.metadata("design:paramtypes", [CreateDto])
      create(@Body() createDto: C) {
        return this.genericRepository.create(createDto)
      }
    
      @Get(primaryKeyRoute)
      getOne(@Param(primaryKey) pk: T[typeof primaryKey]) {
        return this.genericRepository.getOne({ [primaryKey]: pk } as Partial<T>)
      }
    
      @Get()
      getAll() {
        return this.genericRepository.getAll()
      }
    
      @Delete(primaryKeyRoute)
      deleteOne(@Param(primaryKey) pk: T[typeof primaryKey]) {
        return this.genericRepository.deleteOne({ [primaryKey]: pk } as Partial<T>)
      }
    
      @Put(primaryKeyRoute)
      @Reflect.metadata("design:paramtypes", [String, UpdateDto])
      update(@Param(primaryKey) pk: T[typeof primaryKey], @Body() updateDto: U) {
        return this.genericRepository.updateOne({ [primaryKey]: pk } as Partial<T>, updateDto)
      }
    }
  
    return CrudController
  }