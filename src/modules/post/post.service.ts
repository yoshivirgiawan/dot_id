import {
  Injectable,
  Inject,
  Logger,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post as PostEntity } from './post.entity';
import { Cache } from 'cache-manager';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CommentService } from '../comment/comment.service';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly httpService: HttpService,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    private readonly commentService: CommentService,
  ) {}

  async fetchPostsFromAPI(): Promise<PostEntity[]> {
    const { data: apiPosts }: { data: PostEntity[] } = await firstValueFrom(
      this.httpService.get('https://jsonplaceholder.typicode.com/posts'),
    );

    const postsToSave: PostEntity[] = [];
    for (const apiPost of apiPosts) {
      const existingPost = await this.postRepository.findOne({
        where: { id: apiPost.id },
      });
      if (!existingPost) {
        const post = this.postRepository.create(apiPost);
        postsToSave.push(post);
      }
    }

    if (postsToSave.length > 0) {
      await this.postRepository.save(postsToSave);
      this.logger.log(`Saved ${postsToSave.length} new posts to the database`);
    } else {
      this.logger.log('No new posts to save');
    }

    await this.commentService.fetchAndSaveComments();

    return this.postRepository.find({
      relations: ['comments'],
    });
  }

  async getAllPosts(): Promise<PostEntity[]> {
    const cachedData = await this.cacheManager.get<PostEntity[]>('posts');
    if (cachedData) {
      this.logger.log('Returning cached data');
      return cachedData;
    }

    const posts = await this.fetchPostsFromAPI();
    await this.cacheManager.set('posts', posts, 3600);
    this.logger.log('Fetched data from API and cached it');
    return posts;
  }

  async getPostsByUserId(userId: number): Promise<PostEntity[]> {
    return this.postRepository.find({
      where: { userId },
      relations: ['comments'],
    });
  }

  async getPostById(id: number): Promise<PostEntity> {
    return this.postRepository.findOne({
      where: { id },
      relations: ['comments'],
    });
  }

  async createPost(
    createPostDto: CreatePostDto,
    userId: number,
  ): Promise<PostEntity> {
    const { data: apiPost }: { data: PostEntity } = await firstValueFrom(
      this.httpService.post('https://jsonplaceholder.typicode.com/posts', {
        ...createPostDto,
        userId,
      }),
    );

    const post = this.postRepository.create(apiPost);
    await this.postRepository.save(post);

    await this.cacheManager.del('posts');
    this.logger.log('Created post and invalidated cache');

    return post;
  }

  async updatePost(
    id: number,
    updatePostDto: UpdatePostDto,
    userId: number,
  ): Promise<PostEntity> {
    const existingPost = await this.postRepository.findOne({ where: { id } });

    if (!existingPost) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    if (existingPost.userId !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to update this post',
      );
    }

    const { data: apiPost } = await firstValueFrom(
      this.httpService.put(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        id,
        userId,
        ...updatePostDto,
      }),
    );

    await this.postRepository.update(id, apiPost);

    await this.cacheManager.del('posts');
    this.logger.log('Updated post and invalidated cache');

    return this.postRepository.findOne({ where: { id } });
  }

  async patchPost(
    id: number,
    updatePostDto: UpdatePostDto,
    userId: number,
  ): Promise<PostEntity> {
    const existingPost = await this.postRepository.findOne({ where: { id } });

    if (!existingPost) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    if (existingPost.userId !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to update this post',
      );
    }

    const { data: apiPost } = await firstValueFrom(
      this.httpService.patch(
        `https://jsonplaceholder.typicode.com/posts/${id}`,
        updatePostDto,
      ),
    );

    await this.postRepository.update(id, apiPost);

    await this.cacheManager.del('posts');
    this.logger.log('Patched post and invalidated cache');

    return this.postRepository.findOne({ where: { id } });
  }

  async deletePost(id: number, userId: number): Promise<void> {
    const existingPost = await this.postRepository.findOne({ where: { id } });

    if (!existingPost) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    if (existingPost.userId !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to update this post',
      );
    }

    await firstValueFrom(
      this.httpService.delete(
        `https://jsonplaceholder.typicode.com/posts/${id}`,
      ),
    );

    await this.postRepository.delete(id);

    await this.cacheManager.del('posts');
    this.logger.log('Deleted post and invalidated cache');
  }
}
