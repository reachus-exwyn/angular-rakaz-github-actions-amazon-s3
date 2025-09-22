import { Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { superadmintabledata } from './superadmin-dashboard-table';
import { GridApi } from 'ag-grid-community';
import { ColDef } from 'ag-grid-community';
import { ActionDropdownRendererComponent } from '../action-dropdown-renderer/action-dropdown-renderer.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerAdminFormComponent } from '../../modals/customer-admin-form/customer-admin-form.component';
import { SuperAdminService } from '../../services/super-admin.service';

@Component({
  selector: 'app-customer-admin-details',
  templateUrl: './customer-admin-details.component.html',
  styleUrls: ['./customer-admin-details.component.scss'],
})
export class CustomerAdminDetailsComponent implements OnInit {
  pageSize = 10; // or bind this from user selection
  pageSizeSelector = [10, 20, 50, 100];
  rowHeight = 40; // default row height (or whatever you use)
  gridApi!: GridApi<any>;

  columnDefs: ColDef[] = [
    { field: 'adminId', headerName: 'Customer Admin ID' },
    { field: 'adminName', headerName: 'Customer Admin Name' },
    { field: 'adminType', headerName: 'Customer Admin Type' },
    { field: 'organization', headerName: 'Organization Name' },
    { field: 'contactPerson', headerName: 'Contact Person Name' },
    { field: 'contactNumber', headerName: 'Contact Number' },
    { field: 'email', headerName: 'Email' },
    { field: 'currency', headerName: 'Currency' },
    { field: 'plotno', headerName: 'Plot No, Street Name' },
    { field: 'city', headerName: 'City' },
    { field: 'state', headerName: 'State' },
    { field: 'country', headerName: 'Country' },
    {
      headerName: 'Action',
      cellRenderer: ActionDropdownRendererComponent,
      suppressNavigable: true,
      suppressKeyboardEvent: () => true, // ✅ blocks keyboard for this cell
      cellRendererParams: {
        suppressDoubleClickEdit: true,
        staticLabel: 'customerAdmin',
        onActionCompleted: (eventType: string, rowData: any) => {
          if (eventType === 'edit' || eventType === 'delete') {
            this.getCustomerAdmins();
          }
        }
      },
      cellClass: 'no-select',
    },
  ];
  defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  rowData: any[] = [];

  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private superAdminService: SuperAdminService
  ) {}
  ngOnInit(): void {
    this.getCustomerAdmins();
  }

  getCustomerAdmins(search: string = '') {
    const data = {
      page: 1,
      search: search,
    };
    this.superAdminService.getCustomerAdmins(data).subscribe((res: any) => {
      if (res.results.data.length > 0) {
        this.rowData = res.results.data.map((item: any) => ({
          id: item.id,
          adminId: item.customer_id,
          adminName: item.customer_admin_name,
          adminType: item.cust_admin_type,
          organization: item.organization_name || '',
          contactPerson: item.contact_person_name || '',
          contactNumber: item.contact_number || '',
          email: item.email || '',
          currency: item.currency || '',
          plotno: item.address || '',
          city: item.city_name || '',
          state: item.state_name || '',
          country: item.country_name || '',
        }));

        this.gridApi.setRowCount(this.rowData.length);        
      }
    });
  }

  onGridReady(params: any) {
    this.gridApi = params.api;

    // Wait a tick to let DOM render
    setTimeout(() => {
      document.querySelectorAll('.edit-action').forEach((el) => {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          const rowNode = this.getRowFromElement(el);
          console.log('Edit clicked for row', rowNode?.data);
        });
      });

      document.querySelectorAll('.delete-action').forEach((el) => {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          const rowNode = this.getRowFromElement(el);
          console.log('Delete clicked for row', rowNode?.data);
        });
      });
    }, 0);
  }

  // Helper to trace back row data
  getRowFromElement(element: Element): any {
    const rowEl = element.closest('.ag-row') as HTMLElement;
    const rowIndex = rowEl?.getAttribute('row-index');
    return this.gridApi?.getDisplayedRowAtIndex(Number(rowIndex));
  }

  onQuickFilterChanged(event: any) {
    const filterValue = event.target.value;
    if (this.gridApi) {
      this.getCustomerAdmins(filterValue);     
    } else {
      console.warn('Grid API not available yet.');
    }
  }
  onPaginationChanged() {
    if (!this.gridApi) return;

    const currentPageSize = this.gridApi.paginationGetPageSize();
    const rowCount = this.gridApi.paginationGetRowCount();
    const rowsOnCurrentPage = Math.min(currentPageSize, rowCount);

    const baseRowCount =
      currentPageSize >= 20 ? currentPageSize + 10 : currentPageSize;
    const newHeight = baseRowCount * this.rowHeight + 100; // +100 for header, footer, etc.

    const gridDiv = document.querySelector('.ag-rakz-custom') as HTMLElement;
    if (gridDiv) {
      gridDiv.style.height = `${newHeight}px`;
    }
  }

  openCustomerAdminModal(type: 'create' | 'edit', formData?: any) {
    // Add scroll lock class to body
    document.body.classList.add('modal-open-scroll-lock');

    const modalRef = this.modalService.open(CustomerAdminFormComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
      windowClass: 'custom-modal-class',
    });

    modalRef.componentInstance.mode = type;
    modalRef.componentInstance.data = formData || null;

    modalRef.result
      .then((result) => {
        if (result === 'saved') {
          console.log('Customer admin created/updated.');
          this.getCustomerAdmins();
        }
        // Remove scroll lock
        document.body.classList.remove('modal-open-scroll-lock');
      })
      .catch(() => {
        // Remove scroll lock even on dismiss
        document.body.classList.remove('modal-open-scroll-lock');
      });

  }
}
