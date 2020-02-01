import {Injectable} from '@angular/core';
import {Block} from '../objects/block';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Constants} from '../utils/constants';
import {Transaction} from '../objects/transaction';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  blocks: Block[] = [];

  constructor(private httpClient: HttpClient) {
  }

  fetchLatestBlock() {
    this.httpClient.get(Constants.BLOCK_HASH_URL, {responseType: 'text'}).subscribe(hash => {
      this.fetchBlock(hash);
    });
  }

  fetchBlock(hash: string) {
    this.httpClient.get<Block>(Constants.BLOCK_URL + hash + Constants.PARAMS).subscribe(block => {
      this.processRawBlock(block);
    });
  }

  processRawBlock(block: Block) {
    block.tx.sort(((a, b) => a.time.toString().localeCompare(b.time.toString())));

    const newBlock = new Block(block.tx[0].size);
    let currentTimestamp = block.tx[0].time;
    let currentTransaction = new Transaction(0, currentTimestamp);
    block.tx.forEach(transaction => {
      if (transaction.time === currentTimestamp) {
        currentTransaction.size += transaction.size;
      } else {
        newBlock.tx.push(currentTransaction);
        currentTimestamp = transaction.time;
        currentTransaction = new Transaction(transaction.size, currentTimestamp);
      }

      if (transaction.size > newBlock.maxValue) {
        newBlock.maxValue = transaction.size;
      }
    });
    this.blocks.push(newBlock);
    console.log(newBlock);
  }
}
