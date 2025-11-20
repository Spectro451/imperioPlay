import { Injectable } from '@nestjs/common';
import { Prisma, intercambioJuego } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class IntercambioJuegoService {
  constructor(private prisma: PrismaService){}

  async create(data: Prisma.intercambioJuegoCreateInput): Promise<intercambioJuego>{
    return this.prisma.intercambioJuego.create({data});
  }

  async findall():Promise<intercambioJuego[]> {
    return this.prisma.intercambioJuego.findMany();
  }

  async findOne(id:number) :Promise<intercambioJuego | null>{
    return this.prisma.intercambioJuego.findUnique({
      where:{id},
    });
  }

  async update(id:number, data:Prisma.intercambioJuegoUpdateInput): Promise<intercambioJuego>{
    return this.prisma.intercambioJuego.update({
      where: {id},
      data,
    });
  }

  async remove(id:number):Promise<intercambioJuego>{
    return this.prisma.intercambioJuego.delete({
      where:{id},
    });
  }
}
