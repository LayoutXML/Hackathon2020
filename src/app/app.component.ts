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

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit(): void {
    this.apiService.fetchLatestBlock();
  }
}
