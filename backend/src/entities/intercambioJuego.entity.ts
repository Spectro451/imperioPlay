import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Intercambio } from './intercambio.entity';
import { Juego } from './juego.entity';
import { rolIntercambio } from './enums';

@Entity()
export class IntercambioJuego {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  intercambio_id: number;

  @Column()
  juego_id: number;

  @Column({ type: 'enum', enum: rolIntercambio })
  rol: rolIntercambio;

  @Column()
  cantidad: number;

  @ManyToOne(() => Intercambio, (intercambio) => intercambio.intercambioJuegos)
  intercambio: Intercambio;

  @ManyToOne(() => Juego, (juego) => juego.intercambioJuegos)
  juego: Juego;
}
