import { Injectable } from '@nestjs/common';
import { Prisma, Producto } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductoService {
  constructor(private prisma: PrismaService){}

  async create(data: Prisma.ProductoCreateInput): Promise<Producto>{
    return this.prisma.producto.create({data});
  }

  async findall():Promise<Producto[]> {
    return this.prisma.producto.findMany();
  }

  async findOne(id:number) :Promise<Producto | null>{
    return this.prisma.producto.findUnique({
      where:{id},
    });
  }

  async update(id:number, data:Prisma.ProductoUpdateInput): Promise<Producto>{
    return this.prisma.producto.update({
      where: {id},
      data,
    });
  }

  async remove(id:number):Promise<Producto>{
    return this.prisma.producto.delete({
      where:{id},
    });
  }
}
