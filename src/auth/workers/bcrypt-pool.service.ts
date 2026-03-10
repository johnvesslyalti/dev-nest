import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as path from 'path';
const Piscina = require('piscina');

@Injectable()
export class BcryptPoolService implements OnModuleInit, OnModuleDestroy {
  private piscina: any;

  onModuleInit() {
    const isTs = __filename.endsWith('.ts');
    let workerPath = path.resolve(__dirname, isTs ? 'bcrypt.worker-loader.js' : 'bcrypt.worker.js');
    
    if (process.env.JEST_WORKER_ID) {
      // Avoid ts-node hangs in Jest by pointing to the pre-built JS worker
      workerPath = path.resolve(__dirname.replace('/src/', '/dist-test/'), 'bcrypt.worker.js');
    }

    const piscinaOptions: any = {
      filename: workerPath,
      // Set reasonable limits based on CPUs to avoid starving the main thread
      minThreads: 2,
    };

    this.piscina = new Piscina(piscinaOptions);
    this.piscina.on('error', (err: any) => {
      console.error('Piscina error inside worker:', err);
    });
  }

  async onModuleDestroy() {
    if (this.piscina) {
      await this.piscina.destroy();
    }
  }

  async hash(password: string, saltOrRounds: number | string = 10): Promise<string> {
    return this.piscina.run({ type: 'hash', payload: { password, saltOrRounds } });
  }

  async compare(data: string, encrypted: string): Promise<boolean> {
    return this.piscina.run({ type: 'compare', payload: { data, encrypted } });
  }
}
