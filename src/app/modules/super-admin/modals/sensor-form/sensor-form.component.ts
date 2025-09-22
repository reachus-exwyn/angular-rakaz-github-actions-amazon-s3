import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SuperAdminService } from '../../services/super-admin.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { AppStateService } from 'src/app/shared/services/app-state.service';
import { thresholdAndIndexValidator } from '../../customvalidators/thresholdandindexvalidator';
@Component({
  selector: 'app-sensor-form',
  templateUrl: './sensor-form.component.html',
  styleUrls: ['./sensor-form.component.scss'],
})
export class SensorFormComponent implements OnInit {
  sensorForm!: FormGroup;
  mode: 'add' | 'edit' = 'add';
  data: any;
  units: string[] = [];
  userId: number = 0;
  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private superAdminService: SuperAdminService,
    private toastService: ToastService,
    private appStateService: AppStateService
  ) {}

  ngOnInit(): void {
    this.sensorForm = this.fb.group({
      sensorType: ['', Validators.required],
      parameters: this.fb.array([this.createParameterGroup()]),
    });
    this.userId = this.appStateService.getUser().user.id;
    this.getUnits();

    if(this.mode === 'edit'){
      this.sensorForm.patchValue({
        sensorType: this.data.name
      });
      const paramFormGroups = this.data.parameters.sort((a: any, b: any) => a.id - b.id).map((param: any) => {
        const group = this.createParameterGroup();
        group.patchValue({
          sensorParameter: param.name,
          unit: param.unit,
          minThreshold: param.min_threshold,
          maxThreshold: param.max_threshold,
          indexStart: param.index_start,
          indexEnd: param.index_end,
        });
        return group;
      });
      
      this.sensorForm.setControl('parameters', this.fb.array(paramFormGroups));
    }
  }

  get parameters(): FormArray {
    return this.sensorForm.get('parameters') as FormArray;
  }

  getUnits() {
    this.superAdminService.getUnits().subscribe(
      (res: any) => {
        if (res.success) {
          this.units = res.data.map((unit: any) => unit.unit_name);
        } else {
          this.toastService.showError(res.message);
        }
      },
      (error: any) => {
        this.toastService.showError(error.error.message);
      }
    );
  }

  createParameterGroup(): FormGroup {
    return this.fb.group({
      sensorParameter: ['', Validators.required],
      unit: ['', Validators.required],
      minThreshold: ['', Validators.required],
      maxThreshold: ['', Validators.required],
      indexStart: ['', Validators.required],
      indexEnd: ['', Validators.required],
    }, {
      validators: thresholdAndIndexValidator
    });
  }

  addParameter(): void {
    this.parameters.push(this.createParameterGroup());
  }

  removeParameter(index: number): void {
    if (this.parameters.length > 1) {
      this.parameters.removeAt(index);
    }
  }


  isFieldInvalid(field: string, index = 0): boolean {
    const paramGroup = this.parameters.at(index) as FormGroup;
  
    // If it's a regular control
    const control = paramGroup.get(field);
    if (control?.invalid && (control.touched || control.dirty)) {
      return true;
    }
  
    // If it's a group-level validation error referring to this field
    const groupErrors = paramGroup.errors;
    return groupErrors?.[field] && (paramGroup.touched || paramGroup.dirty);
  }
  

  onSubmit(): void {

    if (this.sensorForm.valid) {
      const formData = {
        id: null,
        modified_by: this.userId,
        sensortype: this.sensorForm.value.sensorType,
        created_by: this.userId,
        parameters: this.sensorForm.value.parameters.map((param: any) => ({
          sensorParameter: param.sensorParameter,
          unit: param.unit,
          min_threshold_limit: param.minThreshold,
          max_threshold_limit: param.maxThreshold,
          index_start: param.indexStart,
          index_end: param.indexEnd,
        })),
      };
      if(this.mode === 'edit'){
        formData.id = this.data.id;
        this.superAdminService.updateSensor(formData.id,formData).subscribe(
          (res: any) => {
            if(res.success){
              this.toastService.showSuccess(res.message);
              this.activeModal.close('saved');
            }
          },
          (error: any) => {
            this.toastService.showError(error.error.message);
          }
        )
      }else{
        this.superAdminService.createSensor(formData).subscribe(
          (res: any) => {
            if (res.success) {
              this.toastService.showSuccess(res.message);
              this.activeModal.close('saved');
            } else {
              this.toastService.showError(res.message);
            }
          },
          (error: any) => {
            this.toastService.showError(error.error.message);
          }
        );
        this.sensorForm.reset();
      }
      
    } else {
      this.sensorForm.markAllAsTouched();
    }
  }

  close(): void {
    this.activeModal.dismiss();
  }
}
