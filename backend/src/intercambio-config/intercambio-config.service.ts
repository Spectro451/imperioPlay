import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntercambioConfig } from 'src/entities/intercambio-config.entity';

const SINGLETON_ID = 1;
const SEED_INICIAL = { recargo_base: 15000, recargo_por_tier: 5000 };

@Injectable()
export class IntercambioConfigService implements OnModuleInit {
  constructor(
    @InjectRepository(IntercambioConfig)
    private readonly repo: Repository<IntercambioConfig>,
  ) {}

  async onModuleInit(): Promise<void> {
    const existente = await this.repo.findOne({ where: { id: SINGLETON_ID } });
    if (!existente) {
      await this.repo.save(
        this.repo.create({ id: SINGLETON_ID, ...SEED_INICIAL }),
      );
    }
  }

  async get(): Promise<IntercambioConfig> {
    const config = await this.repo.findOne({ where: { id: SINGLETON_ID } });
    if (config) return config;
    return this.repo.save(
      this.repo.create({ id: SINGLETON_ID, ...SEED_INICIAL }),
    );
  }

  async update(data: {
    recargo_base?: number;
    recargo_por_tier?: number;
  }): Promise<IntercambioConfig> {
    const config = await this.get();
    Object.assign(config, data);
    return this.repo.save(config);
  }
}
