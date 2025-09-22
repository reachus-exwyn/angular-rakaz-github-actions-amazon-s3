import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SuperAdminService } from '../../services/super-admin.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { AppStateService } from 'src/app/shared/services/app-state.service';

@Component({
  selector: 'app-configuration-form',
  templateUrl: './configuration-form.component.html',
  styleUrls: ['./configuration-form.component.scss'],
})
export class ConfigurationFormComponent implements OnInit {
  customerAdminTypeForm!: FormGroup;
  unitForm!: FormGroup;
  customerAdminTypes: {id: number, cust_admin_type: string}[] = [];
  units: {id: number, unit_name: string}[] = [];

  selectedCustomerAdminTypes: number[] = [];
  selectedUnits: number[] = [];
  userId: number = 0;
  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private superAdminService: SuperAdminService,
    private toastService: ToastService,
    private appStateService: AppStateService
  ) {}

  ngOnInit(): void {
    this.customerAdminTypeForm = this.fb.group({
      customerAdminType: ['', Validators.required],
    });

    this.unitForm = this.fb.group({
      unit: ['', Validators.required],
    });
    this.userId = this.appStateService.getUser().user.id;

    this.getCustomerAdminTypes();  
    
    this.getUnits();
  }

  getCustomerAdminTypes() {
    this.superAdminService.getCustomerAdminTypes().subscribe({
      next: (res: any) => {
        if (res.success) {
          if (Array.isArray(res.data)) {
            this.customerAdminTypes = res.data.map((item: any) => {
              return {id: item.id, cust_admin_type: item.cust_admin_type};
            });
          } else {
            this.customerAdminTypes = [];
          }
        } else {
          this.toastService.showError('Customer Admin Type fetching failed');
          this.customerAdminTypes = [];
        }
      },
      error: (error) => {
        console.error("Error fetching customer admin types:", error);
        this.toastService.showError('Customer Admin Type fetching failed');
        this.customerAdminTypes = [];
      }
    })
  }

  getUnits() {
    this.superAdminService.getUnits().subscribe({
      next: (res: any) => {        
        if (res.success) {
          if (Array.isArray(res.data)) {
            this.units = res.data.map((item: any) => {
              return {id: item.id, unit_name: item.unit_name};
            });
          } else {
            this.units = [];
          }
        } else {
          this.toastService.showError('Unit fetching failed');
          this.units = [];
        }
      },
      error: (error) => {
        console.error("Error fetching units:", error);
        this.toastService.showError('Unit fetching failed');
        this.units = [];
      }
    })
  }

  // Add Customer Admin Type
  addCustomerAdminType() {
    const control = this.customerAdminTypeForm.get('customerAdminType');
    control?.markAsTouched(); // Mark as touched so error shows up

    if (control?.invalid) {
      return; // Do nothing if invalid (e.g., empty)
    }

    const value = control?.value.trim();

    if (value && !this.customerAdminTypes.includes(value)) {
      
      this.superAdminService
        .createCustomerAdminType({ cust_admin_type: value, created_by: this.userId })
        .subscribe((res: any) => {
          console.log(res);
          if (res.success) {
            this.customerAdminTypes = [...this.customerAdminTypes, {id: res.data.id, cust_admin_type: value}];
            this.toastService.showSuccess(
              'Customer Admin Type created successfully'
            );
          } else {
            this.toastService.showError('Customer Admin Type creation failed');
          }
        });
      control?.reset(); // Clear input
    }
    else{
      this.toastService.showError('Customer Admin Type already exists');
    }
  }

  // Add Unit
  addUnit() {
    const control = this.unitForm.get('unit');
    control?.markAsTouched();

    if (control?.invalid) {
      return;
    }

    const value = control?.value.trim();

    if (value && !this.units.includes(value)) {      
      this.superAdminService
        .createUnit({ unitname: value, created_by: this.userId})
        .subscribe((res: any) => {
          console.log(res);
          if (res.success) {
            this.units = [...this.units, {id: res.data.id, unit_name: value}];
            this.toastService.showSuccess('Unit created successfully');
          } else {
            this.toastService.showError('Unit creation failed');
          }
        });
      control?.reset();
    }
    else{
      this.toastService.showError('Unit already exists');
    }
  }


    // Delete selected Customer Admin Types
  deleteSelectedCustomerAdminTypes() {
    const ids = this.selectedCustomerAdminTypes;//.map((item) => item.id);

    if (ids.length === 0) {
      this.toastService.showError('Please select at least one item to delete');
      return;
    }

    this.superAdminService
      .deleteCustomerAdminType(ids)
      .subscribe((res: any) => {
        if (res.success) {
          this.toastService.showSuccess(
            'Customer Admin Types deleted successfully'
          );
          // Remove deleted items from the list
          this.customerAdminTypes = this.customerAdminTypes.filter(
            (item) => !ids.includes(item.id)
          );
          this.selectedCustomerAdminTypes = this.selectedCustomerAdminTypes.filter(
            (id) => !ids.includes(id)
          );
          
        } else {
          this.toastService.showError('Customer Admin Types deletion failed');
        }
      });
  }

  // Delete selected Units
  deleteSelectedUnits() {
    const ids = this.selectedUnits;//.map((unit) => unit.id);

    if (ids.length === 0) {
      this.toastService.showError('Please select at least one unit to delete');
      return;
    }

    this.superAdminService.deleteUnit(ids).subscribe((res: any) => {
      if (res.success) {
        this.toastService.showSuccess('Units deleted successfully');

        // Remove deleted units from the list
        this.units = this.units.filter((unit) => !ids.includes(unit.id));
        this.selectedUnits = this.selectedUnits.filter((id) => !ids.includes(id));
        // Clear selection
        
      } else {
        this.toastService.showError('Unit deletion failed');
      }
    });
  }

  close() {
    this.activeModal.dismiss();
  }
}
