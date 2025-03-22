import { Controller, Get, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { ResponseHelper } from '../../common/helpers/response.helper';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  async getAllComments() {
    return ResponseHelper.success(
      'Comments fetched successfully',
      await this.commentService.getAllComments(),
    );
  }

  @Post('fetch')
  async fetchAndSaveComments() {
    await this.commentService.fetchAndSaveComments();
    return ResponseHelper.success('Comments fetched and saved successfully!');
  }
}
