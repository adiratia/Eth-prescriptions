import { RequestData } from './../../models/RequestData';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RequestService } from 'src/app/services/request.service';

@Component({
  selector: 'prescription-request-list',
  templateUrl: './prescription-request-list.component.html',
  styleUrls: ['./prescription-request-list.component.css']
})
export class PrescriptionRequestListComponent implements AfterViewInit {
  
  displayedColumns: string[] = ['client_id', 'client_name', 'medicine_id', 'medicine_name', 'update'];
  dataSource: MatTableDataSource<RequestData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private requestService: RequestService) {
    this.requestService.requestListBehavior.subscribe(requests => {      
      // Assign the data to the data source for the table to render
      this.dataSource = new MatTableDataSource(requests);
    })
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

  accept(index: number, row: RequestData) {
    this.requestService.acceptRequest(row.client_id, row.medicine_id, row.medicine_name, index);
  }
  
  decline(index: number) {
    this.requestService.declineRequest(index);
  }

}
