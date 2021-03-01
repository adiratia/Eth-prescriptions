import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-give-prescription-dialog',
  templateUrl: './give-prescription-dialog.component.html',
  styleUrls: ['./give-prescription-dialog.component.css'],
})
export class GivePrescriptionDialogComponent implements OnInit {
  ngOnInit(): void {}

  form = new FormGroup({
    client_id: new FormControl(this.data.client_id, [Validators.required]),
    medicine_name: new FormControl(this.data.medicine_name, [
      Validators.required,
    ]),
    medicine_id: new FormControl(this.data.medicine_id, [Validators.required]),
    start: new FormControl(null, [Validators.required]),
    end: new FormControl(null, [Validators.required]),
  });

  constructor(
    public dialogRef: MatDialogRef<GivePrescriptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    // this.form.get('client_id').setValue(data.client_id);
    // this.form.get('medicine_name').setValue(data.medicine_name);
    // this.form.get('medicine_id').setValue(data.medicine_id);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
