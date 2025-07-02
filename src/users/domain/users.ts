export class Users {
  constructor(
    public readonly id: number | null,
    public readonly email: string,
    public readonly password: string | null,
    public readonly role: string | null,
    public readonly createdAt: Date | null,
    public readonly updatedAt: Date | null,
  ) {}
}
