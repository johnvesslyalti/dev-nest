import { Module } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { ProfileController } from "./profile.controller";
import { RedisCacheModule } from "../common/cache/cache.module";
import { ProfileRepository } from "./profile.repository";

@Module({
  imports: [RedisCacheModule],
  controllers: [ProfileController],
  providers: [ProfileService, ProfileRepository],
})
export class ProfileModule {}
