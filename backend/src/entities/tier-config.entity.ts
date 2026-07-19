import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('tier_config')
export class TierConfig {
  @PrimaryColumn()
  tier: number;

  @Column({ type: 'int' })
  valor: number;
}
