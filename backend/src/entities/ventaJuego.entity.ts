import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Venta } from './venta.entity';
import { Juego } from './juego.entity';

@Entity()
export class VentaJuego {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  venta_id: number;

  @Column()
  juego_id: number;

  @Column()
  cantidad: number;

  @Column()
  precio_unitario: number;

  @ManyToOne(() => Juego, (juego) => juego.ventaJuegos)
  juego: Juego;

  @ManyToOne(() => Venta, (venta) => venta.ventaJuegos)
  venta: Venta;
}
