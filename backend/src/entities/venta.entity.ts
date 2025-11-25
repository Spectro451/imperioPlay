import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Usuario } from './usuario.entity';
import { VentaDetalle } from './ventaDetalle';
import { metodoPago } from './enums';

@Entity()
export class Venta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fecha: Date;

  @Column({ type: 'enum', enum: metodoPago })
  metodo_pago: metodoPago;

  @Column({ type: 'numeric' })
  monto_pagado: number;

  @Column()
  vendedor_id: number;

  @Column({ nullable: true })
  cliente_id?: number;

  @Column()
  total: number;

  @Column({ nullable: true })
  descuento_porcentaje?: number;

  @Column({ nullable: true })
  descuento_fijo?: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.compras)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Usuario;

  @ManyToOne(() => Usuario, (usuario) => usuario.ventasVendedor)
  @JoinColumn({ name: 'vendedor_id' })
  vendedor: Usuario;

  @OneToMany(() => VentaDetalle, (detalle) => detalle.venta, {
    cascade: true,
  })
  VentaDetalle: VentaDetalle[];
}
