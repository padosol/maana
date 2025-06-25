import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

@Entity({ name: 'users', schema: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role: string; // 'admin' | 'user'

  @Column({ default: '' })
  profile: string;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
