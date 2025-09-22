import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SuperAdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /* Start: Below are the methods for setting up the configuration */
  createCustomerAdminType(data: any) {
    return this.http.post(`${this.apiUrl}customer-admin-types`, data);
  }

  createUnit(data: any) {
    return this.http.post(`${this.apiUrl}units`, data);
  }

  getCustomerAdminTypes() {
    return this.http.get(`${this.apiUrl}customer-admin-types`);
  }

  getUnits() {
    return this.http.get(`${this.apiUrl}units`);
  }

  getCustomerAdminTypeById(id: string) {
    return this.http.get(`${this.apiUrl}customer-admin-types/${id}`);
  }

  getUnitById(id: string) {
    return this.http.get(`${this.apiUrl}units/${id}`);
  }

  updateCustomerAdminType(id: string, data: any) {
    return this.http.put(`${this.apiUrl}customer-admin-types/${id}`, data);
  }

  updateUnit(id: string, data: any) {
    return this.http.put(`${this.apiUrl}units/${id}`, data);
  }

  deleteCustomerAdminType(ids: number[]) {
    return this.http.delete(`${this.apiUrl}customer-admin-types`, { body: { ids } });
  }

  deleteUnit(ids: number[]) {
    return this.http.delete(`${this.apiUrl}units`, { body: { ids } });
  }

  /* End: Methods for setting up the configuration */


  /* Start: Below are the methods for Countries, States and Cities */

  getCountries() {
    return this.http.get(`${this.apiUrl}countries`);
  }

  getStates(countryId: number) {
    return this.http.get(`${this.apiUrl}states/country/${countryId}`);
  }

  getCities(stateId: number) {
    return this.http.get(`${this.apiUrl}cities/state/${stateId}`);
  }

  getCurrencies() {
    return this.http.get(`${this.apiUrl}currencies`);
  }

  

  /* End: Methods for Countries, States and Cities */

  /* Start: Below are the methods for managing the Customer Admins */

  createCustomerAdmin(data: any) {
    return this.http.post(`${this.apiUrl}customer-admins`, data);
  }

  getCustomerAdmins(data: any) {
    return this.http.post(`${this.apiUrl}get-customer-admins`, data);
  }

  getCustomerAdminById(id: any) {
    return this.http.get(`${this.apiUrl}customer-admins/${id}`);
  }

  updateCustomerAdmin(id: any, data: any) {
    return this.http.put(`${this.apiUrl}customer-admins/${id}`, data);
  }

  deleteCustomerAdmin(id: any) {
    return this.http.delete(`${this.apiUrl}customer-admins/${id}`);
  }

  /* End: Methods for managing the Customer Admins */

  /* Start: Below are the methods for managing the Sensors */

  createSensor(data: any) {
    return this.http.post(`${this.apiUrl}sensors`, data);
  }

  getSensors() {
    return this.http.get(`${this.apiUrl}sensors`);
  }

  updateSensor(id: any, data: any) {
    return this.http.put(`${this.apiUrl}sensors/${id}`, data);
  }

  deleteSensor(id: any) {
    return this.http.delete(`${this.apiUrl}sensors/${id}`);
  }

  /* End: Methods for managing the Sensors */


  /* Start: Below are the methods for managing the Devices */

  createDevice(data: any) {
    return this.http.post(`${this.apiUrl}devices`, data);
  }

  getDevices(data: any) {
    return this.http.post(`${this.apiUrl}getAllDevices`, data);
  }

  getDeviceById(id: any) {
    return this.http.get(`${this.apiUrl}devices/${id}`);
  }

  updateDevice(data: any) {
    return this.http.put(`${this.apiUrl}devices/${data.id}`, data);
  }

  deleteDevice(id: any) {
    return this.http.delete(`${this.apiUrl}devices/${id}`);
  }

  /* End: Methods for managing the Devices */

  /* Start: Below are the methods for managing the Device Mappings */

  createDeviceMapping(data: any) {
    return this.http.post(`${this.apiUrl}devices/device-mappings`, data);
  }

  getDeviceMappings(data: any) {
    return this.http.post(`${this.apiUrl}devices/mapping-list`, data);
  }

  getDeviceMappingDetails(id: any) {
    return this.http.get(`${this.apiUrl}devices/mapping-list/${id}`);
  }
  
  /* End: Methods for managing the Device Mappings */


  /* Start: Below are the methods for managing the Reports */

  
  getCustomerAdminsForReport(data: any) {
    return this.http.post(`${this.apiUrl}get-customer-admins`, data);
  }

  getDevicesReport(data: any) {
    return this.http.post(`${this.apiUrl}reports/device-report`, data);
  }

  getCustomerAdminReport(data: any) {
    return this.http.post(`${this.apiUrl}reports/customer-admin-report`, data);
  }


  /* End: Methods for managing the Reports */

}
