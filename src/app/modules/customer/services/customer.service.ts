import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}  

  getCustomerAdminById(id: any) {
    return this.http.get(`${this.apiUrl}customers/${id}`);
  }

  changePassword(id: any,data: any) {
    return this.http.put(`${this.apiUrl}users/${id}/change-password`,data);
  }


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

  getCustomerTypes() {
    return this.http.get(`${this.apiUrl}customer-types`);
  }

  updateCustomerProfile(id: any,data: any){
    return this.http.put(`${this.apiUrl}customers/profile/${id}`,data);
  }
}
