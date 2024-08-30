import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {

  // TODO ESTO ES PARA GUARDAR UN ARCHIVO EN EL FILE SISTEM Y DEVOLVERLO 
  // PERO PODRIA USAR CLOUDINARY
  
  // esto me permite devolver el archivo y servirlo mediante un endpoint
  getStaticProductImage(imageName: string) {

    console.log('entro aca desde el endpoint para obtener imagenes')
    // path join
    const path = join(__dirname, '../../static/products', imageName);

    // si no existe el path jpin
    if (!existsSync(path))
      throw new BadRequestException('No se ha encontrado la imagen');

    return path;
  }
}
