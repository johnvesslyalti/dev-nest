import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { FeedService } from './feed.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getFeed(@Req() req) {
    return this.feedService.getFeed(req.user.id);
  }

  // Test endpoint to add items to feed manually
  @UseGuards(JwtAuthGuard)
  @Post('test')
  async addToFeed(@Req() req, @Body() body: any) {
    return this.feedService.addToFeed(req.user.id, body);
  }
}
