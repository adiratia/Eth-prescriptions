import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';
import * as client from '../../../build/contracts/ClientContract.json';
import { RequestData } from '../models/RequestData';
import { environment } from 'src/environments/environment';
import { Contract } from 'web3-eth-contract';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  requestContract: Contract;
  contractAddress: string;
  abi = [];
  requestList: RequestData[] = [];
  requestListBehavior = new BehaviorSubject<RequestData[]>([]);
  userData: Observable<RequestData[]>;

  constructor(
    private web3Service: Web3Service,
    private _snackBar: MatSnackBar
  ) {
    this.abi = client.abi;
    this.contractAddress = environment.ClientContract;
    this.requestContract = new this.web3Service.web3.eth.Contract(
      this.abi,
      this.contractAddress
    );
    this.userData = this.requestListBehavior.asObservable();
    this.getRequestsFromBlockChain();
  }

  getRequestsFromBlockChain() {
    this.requestContract.methods
      .requestCount()
      .call({ from: this.web3Service.currentAccount })
      .then((counter) => {
        for (let i = 0; i < counter; i++) {
          this.requestContract.methods
            .getRequest(i)
            .call({ from: this.web3Service.currentAccount })
            .then((value) => {
              const req: RequestData = {
                request_number: Number(value[0]),
                client_id: value[1],
                medicine_id: value[2],
                medicine_name: value[3],
                request_date: value[4],
              };
              this.requestList.push(req);
              this.requestListBehavior.next(this.requestList);
            })
            .catch((err) => {
              console.error(err);
              return;
            });
        }
      });
  }

  acceptRequest(
    client_address,
    medicine_id,
    medicine_name,
    index: number,
    givenDate,
    exipredDate
  ) {
    this.requestContract.methods
      .givePerscriptionWithIndex(
        client_address,
        medicine_id,
        medicine_name,
        index,
        givenDate,
        exipredDate
      )
      .send({
        from: this.web3Service.currentAccount,
        gasLimit: 3000000,
        gasPrice: 1,
      })
      .then(() => {
        // notify user of succsess
        this._snackBar.open(`Request #${index + 1} accepted.`, '', {
          duration: 3000,
        });

        this.requestList.splice(index, 1);
        this.requestListBehavior.next(this.requestList);
      })
      .catch((err) => {
        // notify user of succsess
        this._snackBar.open('An error occurred', '', {
          duration: 3000,
        });

        console.error(err);
      });
  }

  declineRequest(index: number) {
    this.requestContract.methods
      .removeRequest(index)
      .send({
        from: this.web3Service.currentAccount,
        gasLimit: 3000000,
        gasPrice: 1,
      })
      .then(() => {
        // notify user of succsess
        this._snackBar.open(`Request #${index + 1} denied.`, '', {
          duration: 3000,
        });

        this.requestList.splice(index, 1);
        this.requestListBehavior.next(this.requestList);
      })
      .catch((err) => {
        // notify user of succsess
        this._snackBar.open('An error occurred.', '', {
          duration: 3000,
        });

        console.error(err);
      });
  }

  requestPerscription(client_id, medicine_name, medicine_id, requestTime) {
    this.requestContract.methods
      .requestPerscription(client_id, medicine_id, medicine_name, requestTime)
      .send({
        from: client_id,
        gasLimit: 3000000,
        gasPrice: 1,
      })
      .then(() => {
        // notify user
        this._snackBar.open(`Request for ${medicine_name} sent.`, '', {
          duration: 3000,
        });

        const req: RequestData = {
          request_number: this.requestList.length,
          client_id,
          medicine_id,
          medicine_name,
          request_date: requestTime,
        };

        this.requestList.push(req);
        this.requestListBehavior.next(this.requestList);
      })
      .catch((err) => {
        // notify user
        this._snackBar.open(`An error occurred.`, '', {
          duration: 3000,
        });
        console.error(err);
      });
  }
}
