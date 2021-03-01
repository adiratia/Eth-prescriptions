import { Web3Service } from './services/web3.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'eth-prescriptions';

  constructor(private web3: Web3Service) {
  }
}
