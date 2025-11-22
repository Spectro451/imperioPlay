import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Juego } from './juego.entity';
import { VentaProducto } from './ventaProducto';
import { tipoProducto } from './enums';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  precio_base: number;

  @Column({ type: 'enum', enum: tipoProducto })
  tipo: tipoProducto;

  @Column({ nullable: true })
  descuento_porcentaje?: number;

  @Column({ nullable: true })
  descuento_fijo?: number;

  @OneToMany(() => Juego, (juego) => juego.producto, { cascade: true })
  juegos: Juego[];

  @OneToMany(() => VentaProducto, (ventaProducto) => ventaProducto.producto)
  ventaProducto: VentaProducto[];

  @Column({ type: 'int' })
  precio_final: number;
}
