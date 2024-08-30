import { v4 as uuid} from 'uuid'

// evaluacion de archivo a subir
export const fileNamer = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  console.log({ file });
  if (!file) return callback('No se ha enviado ningun archivo', false);

  //obtengo la extencion
  const fileExtension = file.mimetype.split('/')[1];

  //genero el nombre del archivo
  const fileName = `${uuid()}.${fileExtension}`;

  
  console.log({ fileName });
  
    //llamo al callback y le paso null y el nombre del archivo
  callback(null, fileName);
};
