import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Venta } from './venta.entity';
import { Intercambio } from './intercambio.entity';
import { Rol } from './enums';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ type: 'enum', enum: Rol })
  rol: Rol;

  @Column({ unique: true })
  correo: string;

  @Column()
  password: string;

  @OneToMany(() => Intercambio, (intercambio) => intercambio.cliente)
  intercambiosCliente: Intercambio[];

  @OneToMany(() => Intercambio, (intercambio) => intercambio.vendedor)
  intercambios: Intercambio[];

  @OneToMany(() => Venta, (venta) => venta.cliente)
  compras: Venta[];

  @OneToMany(() => Venta, (venta) => venta.vendedor)
  ventasVendedor: Venta[];

  @Column({ default: true })
  isActive: boolean;
}
