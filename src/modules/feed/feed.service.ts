import { cacheKeys } from "../../utils/cacheKeys"
import { redis } from "../../utils/redis"
import { feedRepo } from "./feed.repository"

const FEED_TTL = 60

export const feedService = {
    async getHomeFeed(
        userId: string,
        limit: number,
        cursor?: string
    ) {
        const cacheKey = cacheKeys.feed(userId, limit, cursor)

        const cached = await redis.get(cacheKey)

        if (cached) {
            return JSON.parse(cached)
        }

        const feed = await feedRepo.getFeed(userId, limit, cursor);

        const nextCursor =
            feed.length === limit
                ? feed[feed.length - 1].id
                : null

        const response = {
            items: feed,
            nextCursor
        }

        await redis.set(
            cacheKey,
            JSON.stringify(response),
            "EX",
            FEED_TTL
        )
    }
}