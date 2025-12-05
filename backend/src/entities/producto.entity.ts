import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Juego } from './juego.entity';

import { tipoProducto } from './enums';
import { Consolas } from './consola';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ type: 'enum', enum: tipoProducto })
  tipo: tipoProducto;

  @Column({ nullable: true })
  sku: string;

  @OneToMany(() => Juego, (juego) => juego.producto, {
    cascade: true,
    nullable: true,
    onDelete: 'CASCADE',
  })
  juegos?: Juego[];

  @OneToMany(() => Consolas, (consolas) => consolas.producto, {
    cascade: true,
    nullable: true,
  })
  consolas?: Consolas[];
}
