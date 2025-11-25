import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Venta } from './venta.entity';
import { tipoProducto } from './enums';

@Entity()
export class VentaDetalle {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Venta, (venta) => venta.VentaDetalle, {
    onDelete: 'CASCADE',
  })
  venta: Venta;

  @Column()
  item_id: number;

  @Column({ type: 'enum', enum: tipoProducto })
  tipo: tipoProducto;

  @Column()
  cantidad: number;

  @Column({ type: 'int' })
  precio_unitario: number;

  @Column({ type: 'int' })
  subtotal: number;
}
