import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  ParseFilePipeBuilder,
  ParseFilePipe,
  UploadedFiles, BadRequestException,
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
    const uniqueFilename = `${getFileName(
      file.originalname,
    )}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage });

@Controller('common')
export class CommonController {
  //  获取单个文件
  @Post('file')
  @UseInterceptors(FileInterceptor('file', { storage }))
  uploadFile(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    return {
      ...body,
      filePath: file ? `/uploads/${file.filename}` : null,
    };
  }
  // 添加格式校验的上传
  @UseInterceptors(FileInterceptor('file', { storage }))
  @Post('file-validation')
  uploadFileAndPassValidation(
    @Body() body: any,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'pdf',
        })
        .build({
          fileIsRequired: true, // 文件不能为空
          exceptionFactory(err){
            if(err.indexOf('Validation failed') > -1) {
              return new BadRequestException('文件格式不正常')
            }
            let  map = {
              'File is required': '文件不能为空'
            }
            return new BadRequestException(map[err])
          }
        }),
    )
    file?: Express.Multer.File,
  ) {
    return {
      body,
      file: file ? file.path : '',
    };
  }
  @UseInterceptors(FilesInterceptor('files'))
  @Post('files')
  uploadMultipleFiles(
    @Body() body: any,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ // 添加格式校验
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
