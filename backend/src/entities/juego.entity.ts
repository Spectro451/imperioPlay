import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Producto } from './producto.entity';
import { IntercambioJuego } from './intercambioJuego.entity';
import { Consola, estadoJuego } from './enums';

@Entity()
export class Juego {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productoId: number;

  @Column()
  stock: number;

  @Column({ type: 'enum', enum: Consola })
  consola: Consola;

  @Column({ type: 'enum', enum: estadoJuego })
  estado: estadoJuego;

  @Column()
  tier: number;

  @Column('text', { array: true })
  fotos: string[];

  @ManyToOne(() => Producto, (producto) => producto.juegos)
  producto: Producto;

  @OneToMany(
    () => IntercambioJuego,
    (intercambioJuego) => intercambioJuego.juego,
  )
  intercambioJuegos: IntercambioJuego[];
}
