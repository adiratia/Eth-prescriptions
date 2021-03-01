import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import Web3 from 'web3';

declare var window: any;
@Injectable({
  providedIn: 'root',
})
export class Web3Service {
  public web3: Web3;
  public currentAccount;
  public premittedAccounts: [];

  constructor() {
    this.checkAndInstantiateWeb3();

    this.web3.eth.getAccounts((err, acc) => {
      if (!err && acc.length !== 0) {
        this.currentAccount = acc[0];
      }
    });
  }

  checkAndInstantiateWeb3() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      // this.web3 = new Web3(window.web3.currentProvider);
      this.web3 = new Web3(window.ethereum);
    } else {
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      this.web3 = new Web3(
        new Web3.providers.HttpProvider(environment.HttpProvider)
      );
    }

    window.ethereum.on('accountsChanged', () => {
      location.reload();
    });
  }

  connect() {
    window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then(() => {
        location.reload();
      })
      .catch((err) => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          console.log('Please connect to MetaMask.');
          alert('Please connect to MetaMask.');
        } else {
          console.error(err);
        }
      });
  }

  isDeployer(): boolean {
    return this.currentAccount === environment.Deployer;
  }
}
