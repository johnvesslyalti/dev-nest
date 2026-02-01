import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
          if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
              return callback(new Error('Only image files are allowed!'), false);
          }
          callback(null, true);
      }
    }),
  )
  async create(
    @Req() req: any,
    @Body() body: { content: string },
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const imageUrl = file ? `/uploads/${file.filename}` : undefined;
    const post = await this.postsService.create(req.user.id, body.content, imageUrl);
    return { message: 'Post created', post };
  }

  @Get('user/:username')
  async findByUserName(@Param('username') username: string) {
    return this.postsService.findByUserName(username);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }
 
  // Add endpoint for public feed if not covered by home module
  // Existing app has "home" module for feed, but postRepo has findPublicFeed.
  // We can expose it here or keep it for HomeModule.
  // The user migration plan mentioned "Migrate Posts Module". 
  // Let's keep public feed here for now or standard findAll?
  // Let's add it as generic GET /, but maybe that conflicts with findOne /:id?
  // No, GET / is fine.
  @Get()
  async findAll() { 
      return this.postsService.findPublicFeed();
  }
}
