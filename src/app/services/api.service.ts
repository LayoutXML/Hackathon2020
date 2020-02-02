import {EventEmitter, Injectable, OnDestroy, OnInit} from '@angular/core';
import {Block} from '../objects/block';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Constants} from '../utils/constants';
import {Transaction} from '../objects/transaction';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class ApiService implements OnDestroy {

  blocks: Block[] = [];
  transactions: EventEmitter<Transaction> = new EventEmitter<Transaction>();
  webSocket: WebSocketSubject<any> = webSocket('wss://ws.blockchain.info/inv');
  currentTime = 0;
  currentSum = 0;

  constructor(private httpClient: HttpClient) {
    this.webSocket.next({op: 'unconfirmed_sub'});
    this.webSocket.asObservable().subscribe(data => {
      if (this.currentTime !== data.x.time) {
        this.transactions.emit(new Transaction(this.currentSum, this.currentTime));
        this.currentTime = data.x.time;
        this.currentSum = data.x.size;
      } else {
        this.currentSum += data.x.size;
      }
    });
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

  ngOnDestroy(): void {
    this.webSocket.unsubscribe();
  }
}
