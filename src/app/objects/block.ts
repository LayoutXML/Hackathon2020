import {Transaction} from './transaction';

export class Block {
  hash: string;
  time: string;
  size: number;
  tx: Transaction[] = [];
  maxValue: number;

  constructor(maxValue: number) {
    this.maxValue = maxValue;
  }
}
