import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { OpenAIService } from "../common/openai/openai.service";

@Injectable()
@Processor("post-enhancement")
export class PostEnhancementProcessor extends WorkerHost {
  private readonly logger = new Logger(PostEnhancementProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly openaiService: OpenAIService,
  ) {
    super();
  }

  async process(job: Job<{ postId: string }>): Promise<any> {
    const { postId } = job.data;
    this.logger.log(`Enhancing post ${postId}...`);

    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      this.logger.warn(`Post ${postId} not found for enhancement.`);
      return;
    }

    const { summary, tags } = await this.openaiService.generateSummaryAndTags(post.content);

    await this.prisma.post.update({
      where: { id: postId },
      data: {
        aiSummary: summary,
        aiTags: tags,
      },
    });

    this.logger.log(`Post ${postId} enhanced with AI summary and tags.`);
    return { summary, tagsCount: tags.length };
  }
}
