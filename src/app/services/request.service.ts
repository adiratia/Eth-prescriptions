import { MedicineService } from './medicine.service';
import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';
import * as client from '../../../build/contracts/ClientContract.json';
import { RequestData } from '../models/RequestData';
import { environment } from 'src/environments/environment';
import { Contract } from 'web3-eth-contract';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  requestContract: Contract;
  contractAddress: string;
  abi = [];
  requestList: RequestData[] = [];
  requestListBehavior = new BehaviorSubject<RequestData[]>([]);
  userData: Observable<RequestData[]>;
  
  constructor(private web3Service: Web3Service, private medicineService: MedicineService) { 
    this.abi = client.abi;
    this.contractAddress = environment.ClientContract;
    this.requestContract = new this.web3Service.web3.eth.Contract(this.abi, this.contractAddress);
    this.userData = this.requestListBehavior.asObservable()
    this.getRequestsFromBlockChain();
  }

  getRequestsFromBlockChain() {
    this.requestContract.methods.requestCount().call().then(counter => {
      for (let i = 0; i < counter; i++) {
        this.requestContract.methods.getRequest(i).call().then((value) => {
          console.log(value);
          const req: RequestData = {
            request_number: Number(value[0]), client_id: value[1], medicine_id: value[2], medicine_name: value[3]
          };
          this.requestList.push(req);
          this.requestListBehavior.next(this.requestList);
        })
        .catch(err => {
          console.error(err);
          return;
        });
      }
    });
  }
  
  getPerscriptionFromBlockChain() {
    this.requestContract.methods.perscriptionCount().call().then(counter => {
      for (let i = 0; i < counter; i++) {
        this.requestContract.methods.getPerscription(i).call().then((value) => {
          const req: RequestData = {
            request_number: Number(value[0]), client_id: value[1], medicine_id: value[2], medicine_name: value[3]
          };
          this.requestList.push(req);
          this.requestListBehavior.next(this.requestList);
        })
        .catch(err => {
          console.error(err);
          return;
        });
      }
    });
  }


/*Accept perscription request
* parameters : client_address(client wallet id), medicine id, medicine name, index of perscription request
* call to givePerscriptionWithIndex method from ClientContract
*/

  acceptRequest(client_address, medicine_id, medicine_name, index: number) {
    this.requestContract.methods.givePerscriptionWithIndex(client_address, medicine_id, medicine_name, index)
      .send({
        from: this.web3Service.currentAccount,
        gasLimit: 3000000,
        gasPrice: 1
      })
      .then(() => {
        this.requestList.splice(index, 1);
        this.requestListBehavior.next(this.requestList);
      })
      .catch(err => {
        console.error(err);
      });
  }
   /*Decline perscription request
    * get index of the requset
    * call to removeRequest method from  ClientContract
    */
  declineRequest(index: number) {
    this.requestContract.methods.removeRequest(index)
      .send({
        from: this.web3Service.currentAccount,
        gasLimit: 3000000,
        gasPrice: 1
      })
      .then(() => {
        this.requestList.splice(index, 1);
        this.requestListBehavior.next(this.requestList);
      })
      .catch(err => {
        console.error(err);
      });
  }

  /*Add Perscription request from client to doctor
   * parameters : client_id , medicine_name , medicine_id
   * call to requestPerscription method from ClientContract
   * add the request to the request list
    */
  requestPerscription(client_id, medicine_name, medicine_id) {        
    this.requestContract.methods.requestPerscription(client_id, medicine_id, medicine_name).send({
      from: this.web3Service.currentAccount,
      gasLimit: 3000000,
      gasPrice: 1
    })
    .then(() => {
      const req: RequestData = {
        request_number: this.requestList.length, 
        client_id: client_id,
        medicine_id: medicine_id,
        medicine_name: medicine_name
      }
      this.requestList.push(req);
      this.requestListBehavior.next(this.requestList);
    })
    .catch(err => {
      console.error(err);
    });
  }

}
