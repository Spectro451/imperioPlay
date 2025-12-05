import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Producto } from './producto.entity';
import { estadoJuego, Consola } from './enums';

@Entity()
export class Consolas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productoId: number;

  @Column()
  stock: number;

  @Column({ type: 'enum', enum: estadoJuego })
  estado: estadoJuego;

  @Column({ type: 'enum', enum: Consola })
  generacion: Consola;

  @Column()
  precio_base: number;

  @Column({ type: 'int' })
  precio_final: number;

  @Column({ nullable: true })
  descuento_porcentaje?: number;

  @Column({ nullable: true })
  descuento_fijo?: number;

  @Column('text', { array: true })
  fotos?: string[];

  @ManyToOne(() => Producto, (producto) => producto.consolas)
  producto: Producto;
}
