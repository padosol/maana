import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  PENDING = 'PENDING', // 결제 대기 중
  PAID = 'PAID', // 결제 완료
  PROCESSING = 'PROCESSING', // 상품 준비 중 (재고 확보, 포장)
  SHIPPING = 'SHIPPING', // 배송 중
  DELIVERED = 'DELIVERED', // 배송 완료
  CANCELED = 'CANCELED', // 주문 취소
  REFUNDED = 'REFUNDED', // 환불 완료 (부분 환불 포함)
}

@Entity({ name: 'orders', schema: 'orders' }) // 데이터베이스 테이블 이름을 'orders'로 지정
export class Order {
  @PrimaryGeneratedColumn('uuid') // UUID 형식의 기본 키
  id: string;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'userId' }) // 외래 키 컬럼명 지정
  user: User;
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'int' }) // 총 주문 금액 (소수점 처리를 위해 Decimal 또는 float 고려 가능)
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING, // 초기 주문 상태는 결제 대기
  })
  status: OrderStatus;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  orderItems: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  completePayment() {
    this.status = OrderStatus.PAID;
  }

  cancelPayment() {
    this.status = OrderStatus.CANCELED;
  }
}
