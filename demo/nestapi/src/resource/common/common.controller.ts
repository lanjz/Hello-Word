import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  ParseFilePipeBuilder,
  ParseFilePipe,
  UploadedFiles,
} from '@nestjs/common';
import * as multer from 'multer';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

function getFileName(filename) {
  const index = filename.lastIndexOf('.');
  return filename.substring(0, index);
}
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    console.log('file', file);
    const uniqueFilename = `${getFileName(
      file.originalname,
    )}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage });

@Controller('common')
export class CommonController {
  @UseInterceptors(FileInterceptor('file', { storage }))
  @Post('file')
  uploadFile(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    console.log('file', file);
    return {
      body,
      filePath: file ? `/uploads/${file.filename}` : null,
    };
  }

  @UseInterceptors(FileInterceptor('file', { storage }))
  @Post('file/pass-validation')
  uploadFileAndPassValidation(
    @Body() body: any,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'json',
        })
        .build({
          fileIsRequired: false,
        }),
    )
    file?: Express.Multer.File,
  ) {
    return {
      body,
      file: file ? file.path : '',
    };
  }

  @UseInterceptors(FileInterceptor('file', { storage }))
  @Post('file/fail-validation')
  uploadFileAndFailValidation(
    @Body() body: any,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpg',
        })
        .build(),
    )
    file: Express.Multer.File,
  ) {
    return {
      body,
      file: file.buffer.toString(),
    };
  }

  @UseInterceptors(FilesInterceptor('files'))
  @Post('files')
  uploadMultipleFiles(
    @Body() body: any,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpg',
        })
        .build(),
    )
    files: Array<Express.Multer.File>,
  ) {
    console.log('files', files);

    const filePaths = [];
    for (const file of files) {
      const uniqueFilename = `${getFileName(
        file.originalname,
      )}-${uuidv4()}${path.extname(file.originalname)}`;
      fs.writeFileSync(path.join('./uploads', uniqueFilename), file.buffer);
      filePaths.push(`/uploads/${uniqueFilename}`);
    }

    return {
      body,
      filePaths,
    };
  }
}
