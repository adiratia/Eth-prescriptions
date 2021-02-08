import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as med from '../../assets/medicines.json';
import { MedicineData } from '../models/MedicineData';
import { MedicineService } from '../services/medicine.service';
@Component({
  selector: 'medicine-list',
  templateUrl: './medicine-list.component.html',
  styleUrls: ['./medicine-list.component.css']
})
export class MedicineListComponent implements AfterViewInit  {

  displayedColumns: string[] = ['id', 'name', 'brand_name', 'price', 'update'];
  dataSource: MatTableDataSource<MedicineData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  form: FormGroup;

  constructor(private medicineService: MedicineService) {
    this.form = new FormGroup({
      id: new FormControl(),
      name: new FormControl(),
      brand_name: new FormControl(),
      price: new FormControl(),
    });
    
    this.medicineService.medicineListBehavior.subscribe(values => {
      // Assign the data to the data source for the table to render
      this.dataSource = new MatTableDataSource(values);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addMedicineToBlockChain() {
    this.addAll();    
    // if (this.form.valid) {
    //   this.medicineService.addMedicine(this.form.get("id").value, this.form.get("name").value, this.form.get("brand_name").value, Number(this.form.get("price").value));
    //   this.form.reset();
    // }
  }

  removeMedicineToBlockChain(index: number) {    
    this.medicineService.removeMedicine(index);
  }

  addAll() {
    for (let i = 0; i < 5; i++) {
      this.medicineService.addMedicine(med.results[i].product_ndc, med.results[i].generic_name, med.results[i].brand_name, Number(med.results[i].product_price));
    }
  }
}


