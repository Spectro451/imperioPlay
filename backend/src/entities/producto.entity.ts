import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Juego } from './juego.entity';

import { tipoProducto } from './enums';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ type: 'enum', enum: tipoProducto })
  tipo: tipoProducto;

  @OneToMany(() => Juego, (juego) => juego.producto, { cascade: true })
  juegos: Juego[];
}
