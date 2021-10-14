export interface GenericRepository<T> {
    getAll(): Promise<T[]>
    getOne(query: Partial<T>): Promise<T>
    updateOne(query: Partial<T>, data: Partial<T>): Promise<T>
    deleteOne(query: Partial<T>): Promise<T>
    create(data: Partial<T>): Promise<T>
}
