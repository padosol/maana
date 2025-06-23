import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity'; // Order 엔티티 임포트

export enum PaymentMethod {
  CARD = 'CARD', // 신용/체크카드
  VIRTUAL_ACCOUNT = 'VIRTUAL_ACCOUNT', // 가상계좌
  TRANSFER = 'TRANSFER', // 계좌이체
  EASY_PAY = 'EASY_PAY', // 간편결제 (네이버페이, 카카오페이 등)
  PHONE = 'PHONE', // 휴대폰 결제
  POINT = 'POINT', // 포인트 사용 (복합 결제 시)
  // 추가적인 결제 수단 (ex: TOSSPAY, NAVERPAY, KAKAOPAY 등 세분화 가능)
}

export enum PaymentStatus {
  READY = 'READY', // 결제 준비 (토스페이먼츠 위젯 활성화 등)
  PENDING = 'PENDING', // 결제 대기 (가상계좌 입금 대기)
  DONE = 'DONE', // 결제 완료
  CANCELED = 'CANCELED', // 결제 취소
  PARTIAL_CANCELED = 'PARTIAL_CANCELED', // 부분 취소
  FAILED = 'FAILED', // 결제 실패
  ABORTED = 'ABORTED', // 결제 중단 (사용자 이탈 등)
}

@Entity('payments') // 데이터베이스 테이블 이름을 'payments'로 지정
@Index(['orderId', 'paymentKey']) // orderId와 paymentKey 조합으로 인덱스 생성 (조회 성능 향상)
export class Payment {
  @PrimaryGeneratedColumn('uuid') // UUID 형식의 기본 키
  id: string;

  @Column({ type: 'varchar', length: 255 })
  // PG사에서 발급하는 결제 고유 키 (토스페이먼츠의 paymentKey)
  // 이 키를 통해 PG사와 연동하여 결제 상태 조회 및 취소 등의 작업을 수행합니다.
  paymentKey: string;

  @Column({ type: 'varchar', length: 255 })
  // 주문명 (ex: "토스 티셔츠 외 1건")
  // 일반적으로 토스페이먼츠 API 응답의 orderName 필드를 저장
  orderName: string;

  // ManyToOne 관계: 여러 개의 결제가 하나의 주문에 속할 수 있음
  @ManyToOne(() => Order, (order) => order.payments, {
    onDelete: 'CASCADE', // 주문이 삭제되면 관련 결제 기록도 삭제 (적절한 정책 선택)
  })
  @JoinColumn({ name: 'orderId' }) // 외래 키 컬럼명 지정
  order: Order;

  @Column({ type: 'uuid' }) // 외래 키 컬럼 (Order 엔티티의 id와 연결)
  orderId: string;

  @Column({ type: 'enum', enum: PaymentMethod }) // 결제 수단
  method: PaymentMethod;

  @Column({ type: 'int' }) // 실제 결제된 금액
  amount: number;

  @Column({ type: 'int', default: 0 }) // 결제 취소로 환불된 금액 (부분 취소 시 사용)
  canceledAmount: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.READY, // 초기 결제 상태
  })
  status: PaymentStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  // PG사 거래 번호 (ex: 카드사 승인 번호, PG사 내부 거래 ID 등)
  transactionId: string;

  @Column({ type: 'jsonb', nullable: true })
  // PG사에서 받은 원본 결제 응답 데이터 (유연성 확보)
  // 필요에 따라 TossPaymentResponseDto와 같은 DTO 스키마로 강제할 수 있음
  rawData: object;

  @Column({ type: 'datetime', nullable: true }) // 결제 요청 일시
  requestedAt: Date;

  @Column({ type: 'datetime', nullable: true }) // 결제 승인 완료 일시
  approvedAt: Date;

  @Column({ type: 'boolean', default: false }) // 부분 취소 가능 여부
  isPartialCancelable: boolean;

  @CreateDateColumn() // 결제 기록 생성일시
  createdAt: Date;

  @UpdateDateColumn() // 결제 기록 마지막 업데이트 일시
  updatedAt: Date;
}
