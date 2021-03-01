import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';
import * as client from '../../../build/contracts/ClientContract.json';
import { environment } from 'src/environments/environment';
import { Contract } from 'web3-eth-contract';
import { BehaviorSubject, Observable } from 'rxjs';
import { PerscriptionData } from '../models/PerscriptionData';

@Injectable({
  providedIn: 'root',
})
export class PrescriptionService {
  requestContract: Contract;
  contractAddress: string;
  abi = [];
  perscriptionList: PerscriptionData[] = [];
  perscriptionListtBehavior = new BehaviorSubject<PerscriptionData[]>([]);
  userData: Observable<PerscriptionData[]>;

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
    this.userData = this.perscriptionListtBehavior.asObservable();
    this.getPerscriptionsFromBlockChain();
  }

  getPerscriptionsFromBlockChain() {
    this.requestContract.methods
      .perscriptionCount()
      .call()
      .then((counter) => {
        for (let i = 0; i < counter; i++) {
          this.requestContract.methods
            .getPerscription(i)
            .call()
            .then((value) => {
              const per: PerscriptionData = {
                client_id: value[0],
                medicine_id: value[1],
                medicine_name: value[2],
                given_date: value[3],
                expiry_date: value[4],
              };

              if (value[3] <= new Date().getTime() <= value[4]) {
                this.perscriptionList.push(per);
                this.perscriptionListtBehavior.next(this.perscriptionList);
              }
            })
            .catch((err) => {
              console.error(err);
              return;
            });
        }
      });
  }

  givePerscription(
    client_id,
    medicine_id,
    medicine_name,
    given_date,
    expiry_date
  ) {
    this.requestContract.methods
      .givePerscriptionWithoutIndex(
        client_id,
        medicine_name,
        medicine_id,
        given_date,
        expiry_date
      )
      .send({
        from: this.web3Service.currentAccount,
        gasLimit: 3000000,
        gasPrice: 1,
      })
      .then(() => {
        // notify user of succsess
        this._snackBar.open(
          `Perscription to ${client_id} of ${medicine_name} sent.`,
          '',
          {
            duration: 3000,
          }
        );

        const per: PerscriptionData = {
          client_id,
          medicine_id,
          medicine_name,
          given_date,
          expiry_date,
        };
        this.perscriptionList.push(per);
        this.perscriptionListtBehavior.next(this.perscriptionList);
      })
      .catch((err) => {
        // notify user of succsess
        this._snackBar.open('An error occurred.', '', {
          duration: 3000,
        });

        console.error(err);
      });
  }
}
