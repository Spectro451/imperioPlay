import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Check,
  Unique,
  Index,
} from 'typeorm';
import { Usuario } from './usuario.entity';
import { Juego } from './juego.entity';
import { Consola } from './consola';

@Entity('wishlist_items')
@Check(
  `("juegoId" IS NOT NULL AND "consolaId" IS NULL) OR ("juegoId" IS NULL AND "consolaId" IS NOT NULL)`,
)
@Unique(['usuarioId', 'juegoId'])
@Unique(['usuarioId', 'consolaId'])
@Index(['usuarioId'])
export class WishlistItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  usuarioId: number;

  @Column({ nullable: true })
  juegoId?: number | null;

  @Column({ nullable: true })
  consolaId?: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
  usuario: Usuario;

  @ManyToOne(() => Juego, { onDelete: 'CASCADE', nullable: true })
  juego?: Juego;

  @ManyToOne(() => Consola, { onDelete: 'CASCADE', nullable: true })
  consola?: Consola;
}
