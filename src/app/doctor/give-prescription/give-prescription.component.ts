import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { PrescriptionService } from 'src/app/services/prescription.service';

@Component({
  selector: 'give-prescription',
  templateUrl: './give-prescription.component.html',
  styleUrls: ['./give-prescription.component.css'],
})
export class GivePrescriptionComponent implements OnInit {
  form = new FormGroup({
    client_id: new FormControl(),
    medicine_name: new FormControl(),
    medicine_id: new FormControl(),
    start: new FormControl(new Date()),
    end: new FormControl(),
  });

  constructor(private per: PrescriptionService) {
    this.form.get('start').setValue(new Date());
  }

  ngOnInit(): void {}

  givePerscription() {
    if (this.form.valid) {
      this.per.givePerscription(
        this.form.get('client_id').value,
        this.form.get('medicine_id').value,
        this.form.get('medicine_name').value,
        this.form.get('start').value.getTime(),
        this.form.get('end').value.getTime()
      );
      // clear inputs
      this.form.reset();
      // reset errors
      Object.keys(this.form.controls).forEach((key) => {
        this.form.get(key).setErrors(null);
      });
    }
  }
}
