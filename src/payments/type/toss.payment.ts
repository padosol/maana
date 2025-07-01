import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

// 선택 사항: 중첩된 객체를 위한 DTO 정의
// 토스페이먼츠의 card 객체 (예시)
export class CardDto {
  @ApiPropertyOptional({ description: '카드 발급사 코드' })
  @IsOptional()
  @IsString()
  issuerCode?: string;

  @ApiPropertyOptional({ description: '카드 매입사 코드' })
  @IsOptional()
  @IsString()
  acquirerCode?: string;

  @ApiPropertyOptional({ description: '카드 결제 금액' })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiPropertyOptional({
    description: '무이자 할부 여부 (BUYER, SELLTER, NONE)',
  })
  @IsOptional()
  @IsString()
  interestPayer?: string;

  @ApiPropertyOptional({ description: '할부 개월 수' })
  @IsOptional()
  @IsNumber()
  installmentPlanMonths?: number;

  @ApiPropertyOptional({ description: '부분 취소 가능 여부' })
  @IsOptional()
  @IsBoolean()
  isPartialCancelable?: boolean;
}

// 선택 사항: 가상 계좌 객체 (예시)
export class VirtualAccountDto {
  @ApiPropertyOptional({ description: '가상 계좌 번호' })
  @IsOptional()
  @IsString()
  accountNumber?: string;

  @ApiPropertyOptional({ description: '은행 코드' })
  @IsOptional()
  @IsString()
  bankCode?: string;

  @ApiPropertyOptional({ description: '입금자 명' })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiPropertyOptional({
    description: '입금 마감 시간 (YYYY-MM-DDThh:mm:ss±hh:mm)',
  })
  @IsOptional()
  @IsString()
  dueDate?: string;
}

// 선택 사항: 취소 이력 객체 (예시)
export class CancelDto {
  @ApiProperty({ description: '취소된 금액' })
  @IsNumber()
  cancelAmount: number;

  @ApiProperty({ description: '취소 이유' })
  @IsString()
  cancelReason: string;

  @ApiPropertyOptional({ description: '취소된 면세 금액' })
  @IsOptional()
  @IsNumber()
  taxFreeAmount?: number;
}

// 토스페이먼츠 Payment 응답 DTO
export class TossPaymentResponseDto {
  @ApiProperty({ description: '상점 아이디' })
  @IsString()
  mId: string;

  @ApiProperty({ description: 'API 버전' })
  @IsString()
  version: string;

  @ApiProperty({ description: '결제 건을 고유하게 식별하는 키' })
  @IsString()
  paymentKey: string;

  @ApiProperty({ description: '주문 ID (상점에서 발행한 고유 ID)' })
  @IsString()
  orderId: string;

  @ApiProperty({ description: '주문명' })
  @IsString()
  orderName: string;

  @ApiProperty({ description: '통화 (KRW)' })
  @IsString()
  currency: string;

  @ApiProperty({ description: '결제 수단 (카드, 가상계좌 등)' })
  @IsString()
  method: string;

  @ApiProperty({ description: '총 결제 금액' })
  @IsNumber()
  totalAmount: number;

  @ApiProperty({ description: '취소하고 남은 결제 금액' })
  @IsNumber()
  balanceAmount: number;

  @ApiProperty({
    description: '결제 상태 (READY, WAITING_FOR_DEPOSIT, DONE, CANCELED 등)',
  })
  @IsString()
  status: string;

  @ApiProperty({ description: '결제 요청 일시 (YYYY-MM-DDThh:mm:ss±hh:mm)' })
  @IsString()
  requestedAt: string;

  @ApiPropertyOptional({
    description: '결제 승인 일시 (YYYY-MM-DDThh:mm:ss±hh:mm)',
  })
  @IsOptional()
  @IsString()
  approvedAt?: string;

  @ApiProperty({ description: '부분 취소 가능 여부' })
  @IsBoolean()
  isPartialCancelable: boolean;

  @ApiPropertyOptional({
    type: CardDto,
    description: '카드 결제 정보 (method가 card일 경우)',
  })
  @IsOptional()
  @Type(() => CardDto) // class-transformer를 사용하여 중첩 객체 변환
  @ValidateNested() // 중첩 객체 유효성 검사
  card?: CardDto;

  @ApiPropertyOptional({
    type: VirtualAccountDto,
    description: '가상 계좌 정보 (method가 virtualAccount일 경우)',
  })
  @IsOptional()
  @Type(() => VirtualAccountDto)
  @ValidateNested()
  virtualAccount?: VirtualAccountDto;

  @ApiPropertyOptional({ type: [CancelDto], description: '취소 이력 리스트' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true }) // 배열 내 각 요소 유효성 검사
  @Type(() => CancelDto)
  cancels?: CancelDto[];

  // 필요에 따라 더 많은 필드 추가: cashReceipt, discount, gifts etc.
  // easyPay는 Any/Object 타입으로 둘 수도 있습니다.
  @ApiPropertyOptional({ description: '간편결제 정보 (key-value 형태)' })
  @IsOptional()
  easyPay?: Record<string, any>; // 또는 구체적인 DTO 정의
}
