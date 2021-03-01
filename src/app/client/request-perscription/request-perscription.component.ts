import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MedicineData } from 'src/app/models/MedicineData';
import { MedicineService } from 'src/app/services/medicine.service';
import { RequestService } from 'src/app/services/request.service';
import { Web3Service } from 'src/app/services/web3.service';

@Component({
  selector: 'request-perscription',
  templateUrl: './request-perscription.component.html',
  styleUrls: ['./request-perscription.component.css'],
})
export class RequestPerscriptionComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'brand_name', 'price', 'request'];
  dataSource: MatTableDataSource<MedicineData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private medicineService: MedicineService,
    private requestService: RequestService,
    private web3Service: Web3Service,
    private snackBar: MatSnackBar
  ) {
    this.medicineService.medicineListBehavior.subscribe((values) => {
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

  requestPerscription(row: MedicineData) {
    this.requestService.requestPerscription(
      this.web3Service.currentAccount,
      row.name,
      row.id,
      new Date().getTime()
    );
  }
}
