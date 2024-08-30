// evaluacion de archivo a subir
export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  console.log({ file });
  if (!file) return callback('No se ha enviado ningun archivo', false);

  const fileExtension = file.mimetype.split('/')[1];

  const validExtension = ['jpg','jpeg','png', 'gif', 'pdf']

  if (!validExtension.includes(fileExtension)) {
    return callback('El archivo no es una imagen válida', false);
  }

  console.log({ fileExtension });
  
  callback(null, true);
};
