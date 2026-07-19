import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('intercambio_config')
export class IntercambioConfig {
  @PrimaryColumn({ type: 'int', default: 1 })
  id: number;

  @Column({ type: 'int' })
  recargo_base: number;

  @Column({ type: 'int' })
  recargo_por_tier: number;
}
