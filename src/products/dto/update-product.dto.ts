import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

// esto trae todas las propiedads de createproductdto pero las hace opcionales
// por lo que puedo enviar solo titulo o el campo que sea a actualizar
export class UpdateProductDto extends PartialType(CreateProductDto) {}
