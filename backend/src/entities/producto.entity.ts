import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Juego } from './juego.entity';

import { tipoProducto } from './enums';
import { Consola } from './consola';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ type: 'enum', enum: tipoProducto })
  tipo: tipoProducto;

  @Column({ nullable: true, unique: true })
  sku: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Juego, (juego) => juego.producto, {
    cascade: true,
    nullable: true,
    onDelete: 'CASCADE',
  })
  juegos?: Juego[];

  @OneToMany(() => Consola, (consola) => consola.producto, {
    cascade: true,
    nullable: true,
  })
  consolas?: Consola[];
}
