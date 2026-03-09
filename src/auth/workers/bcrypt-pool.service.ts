import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as path from 'path';
import Piscina from 'piscina';

@Injectable()
export class BcryptPoolService implements OnModuleInit, OnModuleDestroy {
  private piscina: Piscina;

  onModuleInit() {
    this.piscina = new Piscina({
      filename: path.resolve(__dirname, 'bcrypt.worker.js'),
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
