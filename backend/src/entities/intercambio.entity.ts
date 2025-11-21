import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Usuario } from './usuario.entity';
import { IntercambioJuego } from './intercambioJuego.entity';
import { metodoPago } from './enums';

@Entity()
export class Intercambio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fecha: Date;

  @Column({ type: 'enum', enum: metodoPago, nullable: true })
  metodo_pago?: metodoPago;

  @Column({ nullable: true })
  dinero_extra?: number;

  @Column()
  vendedor_id: number;

  @Column({ nullable: true })
  cliente_id?: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.intercambiosCliente)
  cliente: Usuario;

  @ManyToOne(() => Usuario, (usuario) => usuario.intercambios)
  vendedor: Usuario;

  @OneToMany(
    () => IntercambioJuego,
    (intercambioJuego) => intercambioJuego.intercambio,
  )
  intercambioJuegos: IntercambioJuego[];
}
