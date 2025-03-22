import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  Patch,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ResponseHelper } from '../../common/helpers/response.helper';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';

@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllPosts(@GetUser() user) {
    return ResponseHelper.success(
      'Posts fetched successfully',
      await this.postService.getPostsByUserId(user.id),
    );
  }

  @Get('fetch')
  async fetchAllPosts() {
    return ResponseHelper.success(
      'Posts fetched successfully',
      await this.postService.getAllPosts(),
    );
  }

  @Get(':id')
  async getPostById(@Param('id') id: number) {
    return ResponseHelper.success(
      'Post fetched successfully',
      await this.postService.getPostById(id),
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async createPost(@Body() createPostDto: CreatePostDto, @GetUser() user) {
    return ResponseHelper.success(
      'Post created successfully',
      await this.postService.createPost(createPostDto, user.id),
    );
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updatePost(
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
    @GetUser() user,
  ) {
    return ResponseHelper.success(
      'Post updated successfully',
      await this.postService.updatePost(id, updatePostDto, user.id),
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async patchPost(
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
    @GetUser() user,
  ) {
    return ResponseHelper.success(
      'Post patched successfully',
      await this.postService.patchPost(id, updatePostDto, user.id),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deletePost(@Param('id') id: number, @GetUser() user) {
    await this.postService.deletePost(id, user.id);
    return ResponseHelper.success('Post deleted successfully');
  }
}
