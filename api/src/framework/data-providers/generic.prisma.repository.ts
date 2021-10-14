import { PrismaService } from './prisma.service';
import { Inject, Injectable } from '@nestjs/common';
import { GenericRepository } from 'src/core/data-providers/generic.repository';

@Injectable()
export class PrismaGenericRepository<T>
  implements GenericRepository<T>
{
    constructor(
        private prisma: PrismaService, 
        @Inject('entityName') private entityName: string
    ) {}

    private get entityDelegate() {
        return this.prisma[this.entityName]
    } 
    
    async getAll(): Promise<T[]> {
        return this.entityDelegate.findMany()
    }

    async getOne(query: Partial<T>): Promise<T> {
        return this.entityDelegate.findFirst({ where: query })
    }

    async updateOne(query: Partial<T>, data: Partial<T>): Promise<T> {
        return this.entityDelegate.update({ where: query, data })
    }

    async deleteOne(query: Partial<T>): Promise<T> {
        return this.entityDelegate.delete({ where: query })
    }

    async create(data: Partial<T>): Promise<T> {
        return this.entityDelegate.create({ data })
    }
}
