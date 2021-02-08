import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';
import * as medicine from '../../../build/contracts/MedicineContract.json';
import { MedicineData } from '../models/MedicineData';
import { environment } from 'src/environments/environment';
import { Contract } from 'web3-eth-contract';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicineService {
  medicineContract: Contract;
  contractAddress: string;
  abi = [];
  medicineList: MedicineData[] = [];
  medicineListBehavior = new BehaviorSubject<MedicineData[]>([]);
  userData : Observable<MedicineData[]>;


  constructor(private web3Service: Web3Service) { 
    this.abi = medicine.abi;
    this.contractAddress = environment.MedicineContract;
    this.medicineContract = new this.web3Service.web3.eth.Contract(this.abi, this.contractAddress);
    this.userData = this.medicineListBehavior.asObservable()
    this.setMedicines();
  }

  addMedicine(id: string, name: string, brand_name: string, price: number) {        
    this.medicineContract.methods.addDrug(id, name, brand_name, price)
    .send({
      from: this.web3Service.currentAccount,
      gasLimit: 3000000,
      gasPrice: 1
    })
    .then(() => {
      const med: MedicineData = {
        id ,name, brand_name, price
      };
      this.medicineList.push(med);
      this.medicineListBehavior.next(this.medicineList);
    })
    .catch(err => {
      console.error(err);
    });
  }

  setMedicines() {
    this.medicineContract.methods.medicineCount().call().then(counter => {
      for (let i = 0; i < counter; i++) {
        this.medicineContract.methods.getMedicine(i).call().then((value) => {
          const med: MedicineData = {
            id: value[0] ,name: value[1], brand_name: value[2], price: value[3]
          };
          this.medicineList.push(med);
          this.medicineListBehavior.next(this.medicineList);
        })
        .catch(err => {
          console.error(err);
          return;
        });
      }
    });
  }

  removeMedicine(index: number) {
    this.medicineContract.methods.removeDrug(index).send({
      from: this.web3Service.currentAccount,
      gasLimit: 3000000,
      gasPrice: 1
    })
    .then(() => {
      this.medicineList.splice(index, 1);
      this.medicineListBehavior.next(this.medicineList);
    })
    .catch(err => {
      console.error(err);
    });
  }

}