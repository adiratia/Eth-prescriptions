import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PerscriptionData } from '../models/PerscriptionData';
import { PrescriptionService } from '../services/prescription.service';
import { Web3Service } from '../services/web3.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements AfterViewInit {

  displayedColumns: string[] = ['client_id', 'medicine_id', 'medicine_name'];
  dataSource: MatTableDataSource<PerscriptionData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private perscriptionService: PrescriptionService, private web3: Web3Service) { 
    this.perscriptionService.perscriptionListtBehavior.subscribe(value => {  
      let v = value.filter((v) => {
        return this.web3.currentAccount == v.client_id;
      });          
      this.dataSource = new MatTableDataSource(v);     
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

}
