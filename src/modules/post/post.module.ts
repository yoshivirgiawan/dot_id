import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post } from './post.entity';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { CommentModule } from '../comment/comment.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Post]),
    CacheModule.register(),
    CommentModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
