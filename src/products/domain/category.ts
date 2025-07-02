export class Category {
  constructor(
    public readonly id: number | null,
    public name: string,
    public description: string | null,
    public parentId: number | null,
  ) {}
}
