import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Venta } from './venta.entity';
import { Producto } from './producto.entity';

@Entity()
export class VentaProducto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  venta_id: number;

  @Column()
  producto_id: number;

  @Column()
  cantidad: number;

  @Column()
  precio_unitario: number;

  @ManyToOne(() => Producto, (producto) => producto.ventaProducto)
  producto: Producto;

  @ManyToOne(() => Venta, (venta) => venta.ventaProducto)
  venta: Venta;
}
