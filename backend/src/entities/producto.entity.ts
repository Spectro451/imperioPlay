import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Juego } from './juego.entity';
import { tipoProducto } from './enums';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  stock: number;

  @Column()
  precio_base: number;

  @Column({ type: 'enum', enum: tipoProducto })
  tipo: tipoProducto;

  @Column({ nullable: true })
  descuento_porcentaje?: number;

  @Column({ nullable: true })
  descuento_fijo?: number;

  @OneToMany(() => Juego, (juego) => juego.producto)
  juegos: Juego[];
}
