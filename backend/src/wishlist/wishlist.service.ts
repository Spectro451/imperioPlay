import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistItem } from 'src/entities/wishlist-item.entity';
import { Juego } from 'src/entities/juego.entity';
import { Consola } from 'src/entities/consola';
import { AddWishlistItemDto } from './dto/add-wishlist-item.dto';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishlistItem)
    private readonly repo: Repository<WishlistItem>,
    @InjectRepository(Juego)
    private readonly juegoRepo: Repository<Juego>,
    @InjectRepository(Consola)
    private readonly consolaRepo: Repository<Consola>,
  ) {}

  async findByUsuario(usuarioId: number): Promise<WishlistItem[]> {
    const items = await this.repo.find({
      where: { usuarioId },
      relations: ['juego', 'juego.producto', 'consola', 'consola.producto'],
      order: { createdAt: 'DESC' },
    });
    return items.filter(
      (i) =>
        (i.juego && i.juego.isActive) || (i.consola && i.consola.isActive),
    );
  }

  async findIdsByUsuario(usuarioId: number): Promise<{
    juegos: Record<number, number>;
    consolas: Record<number, number>;
  }> {
    const items = await this.repo.find({ where: { usuarioId } });
    const juegos: Record<number, number> = {};
    const consolas: Record<number, number> = {};
    for (const i of items) {
      if (i.juegoId != null) juegos[i.juegoId] = i.id;
      if (i.consolaId != null) consolas[i.consolaId] = i.id;
    }
    return { juegos, consolas };
  }

  async add(
    usuarioId: number,
    dto: AddWishlistItemDto,
  ): Promise<WishlistItem> {
    const juegoId = dto.juegoId ?? null;
    const consolaId = dto.consolaId ?? null;

    if ((juegoId && consolaId) || (!juegoId && !consolaId)) {
      throw new BadRequestException(
        'Debe especificar exactamente uno: juegoId o consolaId',
      );
    }

    if (juegoId) {
      const juego = await this.juegoRepo.findOne({
        where: { id: juegoId, isActive: true },
      });
      if (!juego) throw new NotFoundException('Juego no encontrado');
    } else if (consolaId) {
      const consola = await this.consolaRepo.findOne({
        where: { id: consolaId, isActive: true },
      });
      if (!consola) throw new NotFoundException('Consola no encontrada');
    }

    const existente = await this.repo.findOne({
      where: juegoId
        ? { usuarioId, juegoId }
        : { usuarioId, consolaId: consolaId as number },
    });
    if (existente) return existente;

    const item = this.repo.create({ usuarioId, juegoId, consolaId });
    return this.repo.save(item);
  }

  async remove(usuarioId: number, id: number): Promise<void> {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Item no encontrado');
    if (item.usuarioId !== usuarioId) {
      throw new ForbiddenException('No puedes modificar la wishlist de otro usuario');
    }
    await this.repo.delete(id);
  }
}
