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

  dataset = [];
  view: any[] = [1900, 800];
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
        if (this.dataset.length > 15) {
          this.dataset.shift();
        }
        this.dataset = [...this.dataset];
      }
      this.time = new Date();
    });
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

}
