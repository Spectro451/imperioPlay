import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Intercambio } from './intercambio.entity';
import { Juego } from './juego.entity';
import { rolIntercambio } from './enums';

@Entity()
export class IntercambioJuego {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: rolIntercambio })
  rol: rolIntercambio;

  @Column()
  cantidad: number;

  @ManyToOne(
    () => Intercambio,
    (intercambio) => intercambio.intercambioJuegos,
    { nullable: false },
  )
  @JoinColumn({ name: 'intercambio_id' })
  intercambio: Intercambio;

  @ManyToOne(() => Juego, (juego) => juego.intercambioJuegos, {
    nullable: false,
  })
  @JoinColumn({ name: 'juego_id' })
  juego: Juego;
}
