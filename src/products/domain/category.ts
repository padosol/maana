export class Category {
  constructor(
    public readonly id: bigint | null,
    public name: string,
    public description: string | null,
    public parentId: bigint | null,
  ) {}
}
