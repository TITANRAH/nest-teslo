import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Product, ProductImage } from '@prisma/client';
import { validate as isUUID } from 'uuid';
import { UpdateImageDto } from 'src/common/dtos/update-image.dto';

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
        data: {
          ...createProductDto,
          images: {
            create: createProductDto.images
              ? createProductDto.images.map((url) => ({
                  url,
                }))
              : [],
          },
        },
        include: {
          images: true, // con esto me aseguro de incluir las imágenes en la respuesta
        },
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

  findAll(paginationDto: PaginationDto) {
    // como son opcionales aqui siempre tendran un valor inicial 0 o 10
    const { limit = 10, offset = 0 } = paginationDto;
    return this.prismaService.product.findMany({
      take: limit,
      skip: offset,
      include: {
        images: true,
      },
      // relaciones
    });
  }

  async findOne(term: string) {
    let product: Product;

    try {
      if (isUUID(term)) {
        product = await this.prismaService.product.findUnique({
          where: {
            id: term,
          },
          include: {
            images: true,
          },
        });
      } else {
        product = await this.prismaService.product.findFirst({
          where: {
            OR: [
              {
                title: {
                  contains: term.toLocaleLowerCase(),
                  mode: 'insensitive',
                },
              },
              {
                slug: {
                  contains: term.toLocaleLowerCase(),
                  mode: 'insensitive',
                },
              },
            ],
          },
          include: {
            images: true,
          },
        });
      }

      if (!product)
        throw new NotFoundException(
          `Producto con el término o id: ${term} no encontrado`,
        );

      // console.log(product);

      return product;
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  // este dto de updateProduct todas las propiedads de createproductdto pero las hace opcionales
  // por lo que puedo enviar solo titulo o el campo que sea a actualizar o todos los campos si quisiera
  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, ...toUpdate } = updateProductDto;

    console.log(images);

    if (!updateProductDto.slug) {
      updateProductDto.slug = updateProductDto.title
        .toLowerCase()
        .replace(' ', '-')
        .replaceAll("'", '');
    } else {
      updateProductDto.slug = updateProductDto.slug
        .toLowerCase()
        .replace(' ', '-')
        .replaceAll("'", '');
    }

    console.log(updateProductDto);

    try {
      // create query
      if (images) {
        // delete all images
        const deleteImages = await this.prismaService.productImage.deleteMany({
          where: {
            productId: id,
          },
        });

        console.log(deleteImages);

        // create new images
        const newImages = await this.prismaService.productImage.createMany({
          data: images.map((url) => ({
            productId: id,
            url,
          })),
        });

        console.log(newImages);

        const product = await this.prismaService.product.update({
          where: { id: id },
          data: { id, ...toUpdate },
          include: {
            images: true,
          },
        });
        if (!product)
          throw new NotFoundException(
            `Producto con el id: ${id} no encontrado`,
          );

        console.log(product);
        return product;
      } else {
        const product = await this.prismaService.product.update({
          where: { id: id },
          data: { id, ...toUpdate },
          include: {
            images: true,
          },
        });
        if (!product)
          throw new NotFoundException(
            `Producto con el id: ${id} no encontrado`,
          );

        return product;
      }

      // return { ...product };
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: string) {
    try {
      await this.prismaService.product.delete({
        where: {
          id: id,
        },
      });

      return {
        msg: 'Producto eliminado',
      };
    } catch (error) {
      // console.log(error);

      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Producto con el término o id ${id} no encontrado`,
        );
      }
      throw new InternalServerErrorException(
        'Error al eliminar el producto',
        error,
      );
    }
  }
  async removeImage(id: string) {
    try {
      await this.prismaService.productImage.delete({
        where: {
          id: id,
        },
      });

      return {
        msg: 'imagen eliminada',
      };
    } catch (error) {
      // console.log(error);

      if (error.code === 'P2025') {
        throw new NotFoundException(`imagen con el id ${id} no encontrada`);
      }
      throw new InternalServerErrorException(
        'Error al eliminar la imagen',
        error,
      );
    }
  }

  deleteAll() {
    return this.prismaService.product.deleteMany();
  }

  async updateImage(id: string, updateImageDto: UpdateImageDto) {
    console.log({ id, updateImageDto });

    console.log('entro');

    try {
      const image = await this.prismaService.productImage.update({
        where: { id: id },
        data: { url: updateImageDto.url },
      });
      if (!image)
        throw new NotFoundException(`Imagen con el id: ${id} no encontrada`);
      return image;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('msg: Error', error.message);
    }
  }
}
