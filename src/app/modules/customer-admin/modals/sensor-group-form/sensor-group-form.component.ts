import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/shared/services/toast.service';
import { CustomerAdminService } from '../../services/customer-admin.service';
import { SuperAdminService } from '../../../super-admin/services/super-admin.service';
import { AppStateService } from 'src/app/shared/services/app-state.service';

@Component({
  selector: 'app-sensor-group-form',
  templateUrl: './sensor-group-form.component.html',
  styleUrls: ['./sensor-group-form.component.scss'],
})
export class SensorGroupFormComponent implements OnInit {
  form!: FormGroup;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() data: any;
  type: 'create' | 'edit' = 'create';
  customerId: any;
  sensors: any[] = [];
  parametersList: any[] = [];
  organizationId:any;
  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private toastService: ToastService,
    private customerAdminService: CustomerAdminService,
    private superAdminService: SuperAdminService,
    private appStateService: AppStateService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      sensorGroupName: ['', Validators.required],
      sensorType: ['', Validators.required],
      parameters: this.fb.array([]),
    });

    this.getSensors();
    this.addParameter(); // start with 1 empty row
    this.customerId = this.appStateService.getUser().user.id;
    this.organizationId = this.appStateService.getUser().user.organization_id;
  }

  getSensors() {
    this.superAdminService.getSensors().subscribe((res: any) => {
      this.sensors = res.data;
      if (this.mode === 'edit') {
        this.form.patchValue({
          sensorGroupName: this.data.sensor_group_name,
          sensorType: this.data.sensor_type,
          parameters: this.data.parameters,
        });

        this.onSensorTypeChange(this.data.sensor_type);
      }
    });
  }

  get parameters(): FormArray {
    return this.form.get('parameters') as FormArray;
  }

  createParameter(param: any = {}): FormGroup {
    return this.fb.group({
      sensorParameter: [param?.id || '', Validators.required],
      unit: [param.unit || '', Validators.required],
      minThreshold: [
        param.min_threshold_limit ?? '',
        [Validators.required, Validators.min(0)],
      ],
      maxThreshold: [
        param.max_threshold_limit ?? '',
        [Validators.required, Validators.min(0)],
      ],
    });
  }

  onSensorTypeChange(event: Event | any) {
    const type = event.target?.value || event;
    this.parameters.clear();
    this.sensors
      .filter((sensor: any) => sensor.id === parseInt(type))
      .forEach((sensor: any) => {
        this.parametersList = sensor.parameters;

        if(this.mode === 'create'){
        this.parametersList.forEach((parameter: any) => {
          this.parameters.push(this.createParameter(parameter));
        });
        }
        else{
          this.data.parameters.forEach((parameter: any) => {
            // find parameter in master list
            const existingParameter = this.parametersList.find((p: any) => p.id === parseInt(parameter.sensor_parameter));
          
            if (existingParameter) {
              console.log(existingParameter);
              // If found in list, populate with matched parameter
              this.parameters.push(this.createParameter({
                ...existingParameter,
                unit: parameter.unit,
                min_threshold_limit: parameter.min_threshold_limit,
                max_threshold_limit: parameter.max_threshold_limit
              }));
            } else {
              // If not found (maybe removed later from parametersList), still add so data is not lost
              this.parameters.push(this.createParameter({
                id: parameter.sensor_parameter,
                name: parameter.sensor_parameter, // fallback name
                unit: parameter.unit,
                min_threshold_limit: parameter.min_threshold_limit,
                max_threshold_limit: parameter.max_threshold_limit
              }));
            }
          });
          this.parameters.updateValueAndValidity();
        }
      });
  }

  addParameter(param: any = {}) {
    this.parameters.push(this.createParameter(param));
  }

  removeParameter(index: number) {
    this.parameters.removeAt(index);
    this.parameters.updateValueAndValidity();
  }

  onParameterSelect(paramId: any, index: number) {
    const selected = this.parametersList.find((p) => p.id === paramId);

    if (selected) {
      this.parameters.at(index).patchValue({
        unit: selected.unit || '',
        minThreshold: selected.min_threshold_limit ?? '',
        maxThreshold: selected.max_threshold_limit ?? '',
      });
    }
  }

  getAvailableParameters(index: number) {
    const selectedParams = this.parameters.controls.map((ctrl, i) =>
      i !== index ? ctrl.get('sensorParameter')?.value : null
    );

    return this.parametersList.filter(
      (p: any) =>
        !selectedParams.includes(p.id) ||
        p.id === this.parameters.at(index).get('sensorParameter')?.value
    );
  }

  save() {
    if (this.form.valid) {
      if (this.mode === 'create') {
        const formData = {
          sensor_group_name: this.form.value.sensorGroupName,
          sensor_type: this.form.value.sensorType,
          parameters: this.form.value.parameters,
          created_by: this.customerId,
          organization_id:this.organizationId
        };

        this.customerAdminService.createSensorGroup(formData).subscribe(() => {
          this.toastService.showSuccess('Sensor Group saved successfully');
          this.activeModal.close('saved');
        });
      } else {
        const formData = {
          sensor_group_name: this.form.value.sensorGroupName,
          sensor_type: this.form.value.sensorType,
          parameters: this.form.value.parameters,
          modified_by: this.customerId,
          organization_id:this.organizationId
        };
        this.customerAdminService
          .updateSensorGroup(this.data.id, formData)
          .subscribe(() => {
            this.toastService.showSuccess('Sensor Group updated successfully');
            this.activeModal.close('saved');
          });
      }
    } else {
      this.toastService.showError('Please fill all required fields');
    }
  }
}
