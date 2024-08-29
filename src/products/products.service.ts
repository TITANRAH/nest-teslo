import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createProductDto: CreateProductDto) {
    if (!createProductDto.slug) {
      createProductDto.slug = createProductDto.title
        .toLowerCase()
        .replace(' ', '-')
        .replaceAll("'", '');
    } else {
      createProductDto.slug = createProductDto.slug
        .toLowerCase()
        .replace(' ', '-')
        .replaceAll("'", '');
    }
    try {
      const productCreate = await this.prismaService.product.create({
        data: createProductDto,
      });

      return productCreate;
    } catch (error) {
      console.log(error);

      if (error.code === 'P2002') {
        throw new UnprocessableEntityException(
          'El producto ya está registrado',
          error.message,
        );
      }
      throw new InternalServerErrorException(
        'Error al crear el producto',
        error.message,
      );
    }
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
