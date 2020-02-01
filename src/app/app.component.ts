import {Component} from '@angular/core';
import {ApiService} from './services/api.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private httpClient: HttpClient) {
    const apiService = new ApiService(httpClient);
    apiService.fetchLatestBlock();
  }
}
