import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Producto } from './producto.entity';
import { IntercambioJuego } from './intercambioJuego.entity';
import { Plataforma, estadoJuego } from './enums';

@Entity()
export class Juego {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productoId: number;

  @Column()
  stock: number;

  @Column({ type: 'enum', enum: Plataforma })
  consola: Plataforma;

  @Column({ type: 'enum', enum: estadoJuego })
  estado: estadoJuego;

  @Column()
  precio_base: number;

  @Column({ type: 'int' })
  precio_final: number;

  @Column({ nullable: true })
  descuento_porcentaje?: number;

  @Column({ nullable: true })
  descuento_fijo?: number;

  @Column()
  tier: number;

  @Column('text', { array: true })
  fotos?: string[];

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Producto, (producto) => producto.juegos)
  producto: Producto;

  @OneToMany(
    () => IntercambioJuego,
    (intercambioJuego) => intercambioJuego.juego,
  )
  intercambioJuegos: IntercambioJuego[];
}
