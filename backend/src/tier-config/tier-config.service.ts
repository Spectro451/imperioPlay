import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, MoreThan, Repository } from 'typeorm';
import { TierConfig } from 'src/entities/tier-config.entity';
import { Juego } from 'src/entities/juego.entity';

const SEED_INICIAL: Array<{ tier: number; valor: number }> = [
  { tier: 1, valor: 10000 },
  { tier: 2, valor: 20000 },
  { tier: 3, valor: 35000 },
];

@Injectable()
export class TierConfigService implements OnModuleInit {
  constructor(
    @InjectRepository(TierConfig)
    private readonly repo: Repository<TierConfig>,
    private readonly dataSource: DataSource,
  ) {}

  async onModuleInit(): Promise<void> {
    const total = await this.repo.count();
    if (total === 0) {
      await this.repo.save(SEED_INICIAL.map((t) => this.repo.create(t)));
    }
  }

  findAll(): Promise<TierConfig[]> {
    return this.repo.find({ order: { tier: 'ASC' } });
  }

  async getMap(): Promise<Record<number, number>> {
    const tiers = await this.findAll();
    return Object.fromEntries(tiers.map((t) => [t.tier, t.valor]));
  }

  async create(data: { tier: number; valor: number }): Promise<TierConfig> {
    const existente = await this.repo.findOne({ where: { tier: data.tier } });
    if (existente) {
      throw new BadRequestException(`El tier ${data.tier} ya existe`);
    }
    const anterior = await this.repo.findOne({
      where: { tier: data.tier - 1 },
    });
    if (anterior && data.valor <= anterior.valor) {
      throw new BadRequestException(
        `El valor debe ser mayor a ${anterior.valor} (tier ${anterior.tier})`,
      );
    }
    return this.repo.save(this.repo.create(data));
  }

  async update(tier: number, valor: number): Promise<TierConfig> {
    const existente = await this.repo.findOne({ where: { tier } });
    if (!existente) {
      throw new NotFoundException(`Tier ${tier} no encontrado`);
    }
    const anterior = await this.repo.findOne({ where: { tier: tier - 1 } });
    if (anterior && valor <= anterior.valor) {
      throw new BadRequestException(
        `El valor debe ser mayor a ${anterior.valor} (tier ${anterior.tier})`,
      );
    }
    const siguiente = await this.repo.findOne({ where: { tier: tier + 1 } });
    if (siguiente && valor >= siguiente.valor) {
      throw new BadRequestException(
        `El valor debe ser menor a ${siguiente.valor} (tier ${siguiente.tier})`,
      );
    }
    existente.valor = valor;
    return this.repo.save(existente);
  }

  async remove(tier: number): Promise<void> {
    const total = await this.repo.count();
    if (total <= 1) {
      throw new BadRequestException(
        'No se puede eliminar el último tier configurado',
      );
    }
    await this.dataSource.transaction(async (manager) => {
      const existente = await manager.findOne(TierConfig, { where: { tier } });
      if (!existente) {
        throw new NotFoundException(`Tier ${tier} no encontrado`);
      }

      await manager.delete(TierConfig, { tier });

      const superiores = await manager.find(TierConfig, {
        where: { tier: MoreThan(tier) },
        order: { tier: 'ASC' },
      });
      for (const t of superiores) {
        await manager.update(TierConfig, { tier: t.tier }, { tier: t.tier - 1 });
      }

      await manager
        .createQueryBuilder()
        .update(Juego)
        .set({ tier: () => 'tier - 1' })
        .where('tier > :tier', { tier })
        .execute();
    });
  }
}
