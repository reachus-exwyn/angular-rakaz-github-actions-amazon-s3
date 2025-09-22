import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi } from 'ag-grid-community';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {
  pageSize = 20; // example default size
  pageSizeSelector = [10, 20, 50, 100];
  rowHeight = 40;

  columnDefs: ColDef[] = [
    { field: 'customerName', headerName: 'Customer Name' },
    { field: 'planName', headerName: 'Plan Name' },
    { field: 'period', headerName: 'Period' },
    { field: 'currency', headerName: 'Currency' },
    { field: 'paymentProvider', headerName: 'Payment Provider' },
    { field: 'price', headerName: 'Price' },
    { field: 'startDate', headerName: 'Start Date' },
    { field: 'expireDate', headerName: 'Expire Date' },
  ];

  defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  rowData: any[] = []; // this will hold the dummy data

  gridApi!: GridApi<any>;

  ngOnInit(): void {
    this.loadDummyData();
  }

  loadDummyData() {
    this.rowData = [
      {
        customerName: 'John Doe',
        planName: 'Premium',
        period: 'Monthly',
        currency: 'USD',
        paymentProvider: 'Stripe',
        price: 49.99,
        startDate: '2025-09-01',
        expireDate: '2025-09-30'
      },
      {
        customerName: 'Jane Smith',
        planName: 'Basic',
        period: 'Yearly',
        currency: 'EUR',
        paymentProvider: 'PayPal',
        price: 199.99,
        startDate: '2025-01-01',
        expireDate: '2025-12-31'
      },
      {
        customerName: 'Alice Johnson',
        planName: 'Standard',
        period: 'Monthly',
        currency: 'GBP',
        paymentProvider: 'Square',
        price: 29.99,
        startDate: '2025-08-15',
        expireDate: '2025-09-14'
      }
      // Add more rows if needed
    ];
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

 

  
  onPaginationChanged() {
    if (!this.gridApi) return;
    const currentPageSize = this.gridApi.paginationGetPageSize();
    const rowCount = this.gridApi.paginationGetRowCount();
    const rowsOnCurrentPage = Math.min(currentPageSize, rowCount);
    console.log('Rows on current page:', rowsOnCurrentPage);
  }

  onQuickFilterChanged(event: any) {
    const filterValue = event.target.value;
    if (this.gridApi) {
      (this.gridApi as any).setQuickFilter(filterValue);
    }
  }

  onPageSizeChanged(newPageSize: any) {
    console.log(newPageSize);
    if (this.gridApi) {
      (this.gridApi as any).paginationSetPageSize(Number(newPageSize.target.value));
    }
  }
  
  
}
