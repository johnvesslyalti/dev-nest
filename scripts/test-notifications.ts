
import { prisma } from '../src/utils/prisma.ts';
import { NotificationType } from '../src/generated/prisma/enums.ts';
import { notificationQueue } from '../src/jobs/notification.job.ts';

// const prisma = new PrismaClient(); // Removed

async function main() {
  console.log('Starting Notification Test...');

  try {
    // 1. Create Test Users
    const actorEmail = `actor_${Date.now()}@test.com`;
    const recipientEmail = `recipient_${Date.now()}@test.com`;

    const actor = await prisma.user.create({
      data: {
        email: actorEmail,
        username: `actor_${Date.now()}`,
        password: 'password123',
        name: 'Actor User',
      },
    });

    const recipient = await prisma.user.create({
      data: {
        email: recipientEmail,
        username: `recipient_${Date.now()}`,
        password: 'password123',
        name: 'Recipient User',
      },
    });

    console.log(`Created users: Actor (${actor.username}), Recipient (${recipient.username})`);

    // 2. Test Follow Notification
    console.log('Testing Follow Notification...');
    // Simulate follow logic (since we can't easily import service, we mimic trigger)
    // Actually best to use the service if possible, but importing service might bring in auth middleware deps etc.
    // Let's rely on directly adding to queue OR calling service if possible. 
    // Given 'scripts/' location, relative imports to 'src/' might be tricky with ts-node if not configured.
    // Let's just create the DB entries manually and trigger the job manually to test just the job?
    // NO, we want to test the full flow.
    // Let's try to import services.
    
    // Changing approach: minimal DB test + Job test.
    // Let's manually trigger what the service does: DB write + Queue add.
    
    // Follow
    await prisma.follow.create({
      data: {
        followerId: actor.id,
        followingId: recipient.id,
      },
    });
    
    // Manually trigger the queue logic as if the service running
    console.log('Adding follow job to queue...');
    await notificationQueue.add('follow-notification', {
        type: 'FOLLOW', // Using string literal matching enum
        recipientId: recipient.id,
        actorId: actor.id
    });

    // 3. Test Like Notification
    console.log('Testing Like Notification...');
    const post = await prisma.post.create({
        data: {
            authorId: recipient.id,
            content: 'Test post for notifications',
        }
    });

    await prisma.like.create({
        data: {
            userId: actor.id,
            postId: post.id
        }
    });

    console.log('Adding like job to queue...');
    await notificationQueue.add('like-notification', {
        type: 'LIKE',
        recipientId: recipient.id,
        actorId: actor.id,
        postId: post.id
    });

    console.log('Waiting for workers to process...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 4. Verify Notifications
    const notifications = await prisma.notification.findMany({
        where: { recipientId: recipient.id },
        include: { actor: true, post: true }
    });

    console.log(`Found ${notifications.length} notifications for recipient.`);
    
    notifications.forEach(n => {
        console.log(`- Type: ${n.type}, Actor: ${n.actor.username}, Post: ${n.post?.id || 'N/A'}`);
    });

    if (notifications.length >= 2) {
        console.log('✅ SUCCESS: Notifications created successfully!');
    } else {
        console.error('❌ FAILURE: Missing notifications.');
        process.exit(1);
    }

  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    // Clean up queue conn?
    // process.exit(0);
  }
}

main();
