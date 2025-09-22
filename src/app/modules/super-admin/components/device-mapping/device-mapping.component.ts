import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  
import { DeviceMappingFormComponent } from '../../modals/device-mapping-form/device-mapping-form.component';
import { SuperAdminService } from '../../services/super-admin.service';

@Component({
  selector: 'app-device-mapping',
  templateUrl: './device-mapping.component.html',
  styleUrls: ['./device-mapping.component.scss']
})
export class DeviceMappingComponent implements OnInit {

  deviceMappingList: any[] = [];
  deviceMappingListFiltered: any[] = [];
  deviceMappingDetails: any[] = [];
  deviceSensorParameters: any[] = [];
  selectedDeviceId: any;
  selectedSensorType: any;
  constructor(private modalService: NgbModal, private superAdminService: SuperAdminService) {}
  ngOnInit(): void {
    this.getDeviceMappings();
  }

  getDeviceMappings(){
    let data = {
      page: 1,
      limit: 1000
    }
    this.superAdminService.getDeviceMappings(data).subscribe((res: any) => {
      this.deviceMappingList = res.result.data;
      this.deviceMappingListFiltered = this.deviceMappingList;
    });
  }

  getDeviceMappingDetails(id: any){
    this.deviceMappingDetails = [];
     this.deviceSensorParameters = [];
    this.selectedDeviceId = "";
    this.superAdminService.getDeviceMappingDetails(id).subscribe((res: any) => {
      this.deviceMappingDetails = res.result.data;
      this.deviceMappingDetails = this.deviceMappingDetails.map((item: any) => {
        let devices = JSON.parse(item.devices);
      
        // Remove duplicates based on device_id
        devices = devices.filter(
          (device: any, index: number, self: any[]) =>
            index === self.findIndex((d) => d.device_id === device.device_id)
        );
      
        item.devices = devices;

        let params = JSON.parse(item.parameters);
        params = params.filter((param: any, index: number, self: any[]) =>
          index === self.findIndex((p) => p.parameter === param.parameter)
        );
        item.parameters = params;

        item.image = item.sensortype.toLowerCase().includes('air') ? 'assets/air-img.jpg' : item.sensortype.toLowerCase().includes('noise') ? 'assets/noise-img.jpg' : item.sensortype.toLowerCase().includes('water') ? 'assets/water-img.jpg' : 'assets/other-img.jpg';

        return item;
      });
      console.log(this.deviceMappingDetails);
    });
  }

  getDeviceDetails(id: any, type: any){
    this.selectedDeviceId = id;
    this.selectedSensorType = type;
    this.deviceSensorParameters = this.deviceMappingDetails.find((item: any) => item.devices.some((device: any) => device.device_id === id)).parameters;
    this.deviceSensorParameters = this.deviceSensorParameters.map((param: any) => {
      param.image = type.toLowerCase().includes('air') ? 'assets/air-img.jpg' : type.toLowerCase().includes('noise') ? 'assets/noise-img.jpg' : type.toLowerCase().includes('water') ? 'assets/water-img.jpg' : 'assets/other-img.jpg';
      return param;
    });
    console.log(this.deviceSensorParameters);
  }
  

  openDeviceMappingModal(type: 'create' | 'edit', formData?: any) {
     // Add scroll lock class to body
     document.body.classList.add('modal-open-scroll-lock');
  
     const modalRef = this.modalService.open(DeviceMappingFormComponent, {
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
           console.log('Device created/updated.');
         }
         // Remove scroll lock
         document.body.classList.remove('modal-open-scroll-lock');
       });
  }

  searchDeviceMappings(event: any) {
    console.log(event.target.value);
    this.deviceMappingListFiltered = this.deviceMappingList.filter((item: any) => item.customer_admin_name.toLowerCase().includes(event.target.value.toLowerCase()));
  }

}
