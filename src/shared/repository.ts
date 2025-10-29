export class Repository<T extends { id: string }> {
  protected items: T[] = [];

  findAll(): T[] {
    return [...this.items];
  }

  findById(id: string): T | undefined {
    return this.items.find(item => item.id === id);
  }

  create(item: T): T {
    this.items.push(item);
    return item;
  }

  update(id: string, data: Partial<T>): T {
    const item = this.findById(id);
    if (!item) throw new Error('Item not found');
    Object.assign(item, data);
    return item;
  }

  delete(id: string): void {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Item not found');
    this.items.splice(index, 1);
  }
}
