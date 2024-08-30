import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  ParseUUIDPipe,
  Res,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/file.filter.helper';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/file.namer.helper';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Post('product')

  // esto es para decirle necesito esperar un campo llamdo file
  @UseInterceptors(
    FileInterceptor('file', {
      // mandamos la referencia a la funcion no la ejecutamos solo mandamos la referencia
      // cuando cargue un archivo ira primero a la funcion
      fileFilter: fileFilter,
      // limits: {fileSize: 1000}
      storage: diskStorage({
        destination: './static/products',
        filename: fileNamer,
      }),
    }),
  )
  uploadProductFile(@UploadedFile() file: Express.Multer.File) {
    // teniendo esta file ya tengo el archivo para subirlo a cloudinary por ejem

    console.log({ fileInController: file });
    if (!file) throw new BadRequestException('No se ha enviado ningún archivo');

    const secureUrl = `${this.configService.get('HOST_API_IMAGES')}/files/product/${file.filename}`;

    console.log(secureUrl);
    

    return {
      secureUrl,
    };
  }

  @Get('product/:imageName')
  // llamar a decorador nuevo res de expres
  findProductimage(
    // llamo a res de express para devolver el path o la imagen misma
    @Res() res: Response,
    @Param('imageName') imageName: string,
  ) {
    const path = this.filesService.getStaticProductImage(imageName);
    // res.status(403).json({ ok: false, path: path });

    res.sendFile(path);
  }
}
