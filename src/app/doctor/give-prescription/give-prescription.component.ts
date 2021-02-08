import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PrescriptionService } from 'src/app/services/prescription.service';
import { RequestService } from 'src/app/services/request.service';
import { Web3Service } from 'src/app/services/web3.service';

@Component({
  selector: 'give-prescription',
  templateUrl: './give-prescription.component.html',
  styleUrls: ['./give-prescription.component.css']
})
export class GivePrescriptionComponent implements OnInit {

  form: FormGroup;
  
  constructor(private per: PrescriptionService, private web3Service: Web3Service) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      client_id: new FormControl(),
      medicine_name: new FormControl(),
      medicine_id: new FormControl(),
    });
  }

  givePerscription() {
    if (this.form.valid) {
      this.per.givePerscription(this.form.get("client_id").value, this.form.get("medicine_id").value,this.form.get("medicine_name").value);
    }
  }

}
