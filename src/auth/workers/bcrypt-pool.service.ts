import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as path from 'path';
const Piscina = require('piscina');

@Injectable()
export class BcryptPoolService implements OnModuleInit, OnModuleDestroy {
  private piscina: any;

  onModuleInit() {
    // During tests (ts-node), __dirname might point to the src folder and we need the .ts extension.
    // In production, it points to dist and we need .js
    const isTest = process.env.NODE_ENV === 'test' || __dirname.includes('src');
    const workerExt = isTest ? 'ts' : 'js';
    const workerPath = path.resolve(__dirname, `bcrypt.worker.${workerExt}`);

    this.piscina = new Piscina({
      filename: workerPath,
      // Set reasonable limits based on CPUs to avoid starving the main thread
      minThreads: 2,
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
