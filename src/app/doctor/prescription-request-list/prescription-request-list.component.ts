import { GivePrescriptionDialogComponent } from './../give-prescription-dialog/give-prescription-dialog.component';
import { GivePrescriptionComponent } from './../give-prescription/give-prescription.component';
import { RequestData } from './../../models/RequestData';
import {
  AfterViewInit,
  Component,
  ViewChild,
  OnInit,
  Inject,
  AfterContentInit,
  AfterContentChecked,
  ChangeDetectorRef,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RequestService } from 'src/app/services/request.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'prescription-request-list',
  templateUrl: './prescription-request-list.component.html',
  styleUrls: ['./prescription-request-list.component.css'],
})
export class PrescriptionRequestListComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'request_number',
    'client_id',
    'medicine_id',
    'medicine_name',
    'request_date',
    'update',
  ];

  dataSource: MatTableDataSource<RequestData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private requestService: RequestService,
    public dialog: MatDialog
  ) {
    this.requestService.requestListBehavior.subscribe((requests) => {
      // Assign the data to the data source for the table to render
      this.dataSource = new MatTableDataSource(requests);
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

  // accept(index: number, row: RequestData) {
  //   this.requestService.acceptRequest(
  //     row.client_id,
  //     row.medicine_id,
  //     row.medicine_name,
  //     index,
  //     new Date().getTime(),
  //     new Date().getTime()
  //   );
  // }

  decline(index: number) {
    this.requestService.declineRequest(index);
  }

  openDialog(index: number, row: RequestData): void {
    const dialogRef = this.dialog.open(GivePrescriptionDialogComponent, {
      width: '800px',
      data: {
        client_id: row.client_id,
        medicine_id: row.medicine_id,
        medicine_name: row.medicine_name,
        index: index,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.requestService.acceptRequest(
          result.value.client_id,
          result.value.medicine_id,
          result.value.medicine_name,
          index,
          result.value.start.getTime(),
          result.value.end.getTime()
        );
      }
    });
  }
}
