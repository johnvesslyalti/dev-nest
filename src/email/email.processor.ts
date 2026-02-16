import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('email')
export class EmailProcessor extends WorkerHost {
  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'welcome-email':
        console.log(`Sending welcome email to ${job.data.email}`);
        // TODO: Implement actual email sending logic here
        return {};
      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  }
}
