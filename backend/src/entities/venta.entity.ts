import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Usuario } from './usuario.entity';
import { VentaJuego } from './ventaJuego.entity';
import { metodoPago } from './enums';

@Entity()
export class Venta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fecha: Date;

  @Column({ type: 'enum', enum: metodoPago })
  metodo_pago: metodoPago;

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
  cliente: Usuario;

  @ManyToOne(() => Usuario, (usuario) => usuario.ventasVendedor)
  vendedor: Usuario;

  @OneToMany(() => VentaJuego, (ventaJuego) => ventaJuego.venta)
  ventaJuegos: VentaJuego[];
}
