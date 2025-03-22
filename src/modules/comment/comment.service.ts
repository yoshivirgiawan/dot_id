import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';

@Injectable()
export class CommentService {
  private readonly logger = new Logger(CommentService.name);

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async fetchCommentsFromAPI(): Promise<any[]> {
    const { data } = await firstValueFrom(
      this.httpService.get('https://jsonplaceholder.typicode.com/comments'),
    );
    return data;
  }

  async saveCommentsToDatabase(comments: any[]): Promise<Comment[]> {
    const commentsToSave: Comment[] = [];
    for (const comment of comments) {
      const existingComment = await this.commentRepository.findOne({
        where: { id: comment.id },
      });
      if (!existingComment) {
        const commentEntity = new Comment();
        commentEntity.id = comment.id;
        commentEntity.postId = comment.postId;
        commentEntity.name = comment.name;
        commentEntity.email = comment.email;
        commentEntity.body = comment.body;
        commentsToSave.push(commentEntity);
      }
    }

    if (commentsToSave.length > 0) {
      await this.commentRepository.save(commentsToSave);
      this.logger.log(
        `Saved ${commentsToSave.length} new comments to the database`,
      );
    } else {
      this.logger.log('No new comments to save');
    }

    return this.commentRepository.find();
  }

  async fetchAndSaveComments(): Promise<void> {
    const comments = await this.fetchCommentsFromAPI();
    await this.saveCommentsToDatabase(comments);
    this.logger.log('Comments fetched and saved successfully!');
  }

  async getAllComments(): Promise<Comment[]> {
    return this.commentRepository.find();
  }
}
