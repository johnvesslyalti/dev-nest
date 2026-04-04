import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";

@Injectable()
export class OpenAIService {
  private readonly openai: OpenAI;
  private readonly logger = new Logger(OpenAIService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>("OPENAI_API_KEY");
    if (!apiKey) {
      this.logger.warn("OPENAI_API_KEY is not set. OpenAI features will be disabled.");
    }
    this.openai = new OpenAI({
      apiKey: apiKey || "dummy-key",
    });
  }

  async generateSummaryAndTags(content: string): Promise<{ summary: string; tags: string[] }> {
    if (!this.configService.get("OPENAI_API_KEY")) {
      return { summary: content.substring(0, 100), tags: [] };
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant that summarizes developer posts and generates relevant tags.
            Provide output in JSON format: { "summary": "...", "tags": ["tag1", "tag2"] }.
            Summary should be concise (max 2 sentences).
            Tags should be lowercase, max 5 tags.`,
          },
          {
            role: "user",
            content: content,
          },
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      return {
        summary: result.summary || content.substring(0, 100),
        tags: result.tags || [],
      };
    } catch (error) {
      this.logger.error(`Error generating AI content: ${error.message}`);
      return { summary: content.substring(0, 100), tags: [] };
    }
  }
}
