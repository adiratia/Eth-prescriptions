import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';
import * as client from '../../../build/contracts/ClientContract.json';
import { RequestData } from '../models/RequestData';
import { environment } from 'src/environments/environment';
import { Contract } from 'web3-eth-contract';
import { BehaviorSubject, Observable } from 'rxjs';
import { MedicineService } from './medicine.service';
import { PerscriptionData } from '../models/PerscriptionData';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {
  requestContract: Contract;
  contractAddress: string;
  abi = [];
  perscriptionList: PerscriptionData[] = [];
  perscriptionListtBehavior = new BehaviorSubject<PerscriptionData[]>([]);
  userData: Observable<PerscriptionData[]>;

  constructor(private web3Service: Web3Service) { 
    this.abi = client.abi;
    this.contractAddress = environment.ClientContract;
    this.requestContract = new this.web3Service.web3.eth.Contract(this.abi, this.contractAddress);
    this.userData = this.perscriptionListtBehavior.asObservable()
    this.getPerscriptionsFromBlockChain();
  }

  getPerscriptionsFromBlockChain() {
    this.requestContract.methods.perscriptionCount().call().then(counter => {
      for (let i = 0; i < counter; i++) {
        this.requestContract.methods.getPerscription(i).call().then((value) => {
          const per: PerscriptionData = {
            client_id: value[0], medicine_id: value[1], medicine_name: value[2]
          };
          this.perscriptionList.push(per);
          this.perscriptionListtBehavior.next(this.perscriptionList);
        })
        .catch(err => {
          console.error(err);
          return;
        });
      }
    });
  }
/* Give perscription from doctor to client
* parameters : client_id, medicine_id, medicine_name
* call to givePerscriptionWithoutIndex method from ClientContract
* add the perscription to the perscription list
 */


  givePerscription(client_id, medicine_id, medicine_name) {
    this.requestContract.methods.givePerscriptionWithoutIndex(client_id, medicine_name, medicine_id)
      .send({
        from: this.web3Service.currentAccount,
        gasLimit: 3000000,
        gasPrice: 1
      })
      .then(() => {
        const per: PerscriptionData = {
          client_id, medicine_id, medicine_name
        };
        this.perscriptionList.push(per);
        this.perscriptionListtBehavior.next(this.perscriptionList);
      })
      .catch(err => {
        console.error(err);
    });
  }
}
