export class SnowflakeIdGenerator {
  private readonly epoch: number; // 시작 시점 (밀리초)
  private readonly workerId: number; // 워커 ID (0-31)
  private readonly datacenterId: number; // 데이터센터 ID (0-31)

  private sequence: number = 0; // 시퀀스 번호
  private lastTimestamp: number = -1; // 마지막으로 ID를 생성한 타임스탬프

  // 비트 시프트 상수
  private readonly workerIdShift: number = 12;
  private readonly datacenterIdShift: number = 17;
  private readonly timestampShift: number = 22;

  // 마스크 상수
  private readonly sequenceMask: number = 0xfff; // 12비트 (4095)
  private readonly workerIdMask: number = 0x1f; // 5비트 (31)
  private readonly datacenterIdMask: number = 0x1f; // 5비트 (31)

  /**
   * Snowflake ID 생성기를 초기화합니다.
   * @param workerId 워커 ID (0-31)
   * @param datacenterId 데이터센터 ID (0-31)
   * @param epoch 선택적: ID 생성의 시작 시점 (밀리초). 기본값은 2020-01-01T00:00:00.000Z
   */
  constructor(workerId: number, datacenterId: number, epoch?: number) {
    if (workerId < 0 || workerId > this.workerIdMask) {
      throw new Error(`Worker ID must be between 0 and ${this.workerIdMask}`);
    }
    if (datacenterId < 0 || datacenterId > this.datacenterIdMask) {
      throw new Error(
        `Datacenter ID must be between 0 and ${this.datacenterIdMask}`,
      );
    }

    this.workerId = workerId;
    this.datacenterId = datacenterId;
    this.epoch = epoch || new Date('2020-01-01T00:00:00.000Z').getTime();
  }

  /**
   * 다음 Snowflake ID를 생성합니다.
   * @returns 생성된 Snowflake ID (string)
   */
  public nextId(): number {
    let timestamp = this.timeGen();

    if (timestamp < this.lastTimestamp) {
      // 시계가 뒤로 돌아갔을 경우
      throw new Error(
        `Clock moved backwards. Refusing to generate ID for ${this.lastTimestamp - timestamp}ms`,
      );
    }

    if (timestamp === this.lastTimestamp) {
      // 동일 밀리초 내에서 ID를 생성하는 경우 시퀀스 증가
      this.sequence = (this.sequence + 1) & this.sequenceMask;
      if (this.sequence === 0) {
        // 시퀀스 오버플로우 발생 시 다음 밀리초까지 대기
        timestamp = this.tilNextMillis(this.lastTimestamp);
      }
    } else {
      // 새로운 밀리초가 시작되면 시퀀스 초기화
      this.sequence = 0;
    }

    this.lastTimestamp = timestamp;

    // ID 조합 (비트 연산)
    const id =
      (BigInt(timestamp - this.epoch) << BigInt(this.timestampShift)) |
      (BigInt(this.datacenterId) << BigInt(this.datacenterIdShift)) |
      (BigInt(this.workerId) << BigInt(this.workerIdShift)) |
      BigInt(this.sequence);

    return Number(id);
  }

  /**
   * 다음 밀리초까지 대기합니다.
   * @param lastTimestamp 마지막으로 ID를 생성한 타임스탬프
   * @returns 다음 밀리초의 타임스탬프
   */
  private tilNextMillis(lastTimestamp: number): number {
    let timestamp = this.timeGen();
    while (timestamp <= lastTimestamp) {
      timestamp = this.timeGen();
    }
    return timestamp;
  }

  /**
   * 현재 시간을 밀리초 단위로 가져옵니다.
   * @returns 현재 시간 (밀리초)
   */
  private timeGen(): number {
    return Date.now();
  }
}
