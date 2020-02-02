import {Component, OnInit} from '@angular/core';
import {ApiService} from './services/api.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  apiService = new ApiService(this.httpClient);

  time: Date;
  totalSum = 0;
  numberOfBars = 15;

  displayTime;
  displaySum;

  exchangeRate;

  dataset = [];
  view: any[] = [1900, 740];
  showYAxis = true;
  gradient = false;
  showYAxisLabel = true;
  yAxisLabel = 'Transaction Sum';
  colorScheme = {
    domain: ['#A93226']
  };

  constructor(private httpClient: HttpClient) {
    Object.assign(this, {
      single: this.dataset
    });
  }

  ngOnInit(): void {
    this.apiService.transactions.subscribe(transaction => {
      if (transaction.time !== 0) {
        this.dataset.push({name: transaction.time, value: transaction.size});
        this.totalSum += transaction.size;
        while (this.dataset.length > this.numberOfBars) {
          this.dataset.shift();
        }
        this.dataset = [...this.dataset];
      }
      this.time = new Date();
    });
    this.apiService.exchangeRate.subscribe(rate => {
      this.exchangeRate = rate;
    });
  }

  onSelect(data): void {
    this.displayTime = data.name;
    this.displaySum = data.value;
  }

}
