import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../interfaces/employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = 'http://localhost:5001/api/employees';

  constructor(private http: HttpClient) {}

  private getAuthToken(): string {
    const user = (window as any).__HR_PORTAL_USER__;
    return user?.token || '';
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.getAuthToken()}`
    };
  }

  getEmployees(search?: string, page: number = 1, limit: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get(this.apiUrl, {
      params,
      headers: this.getHeaders()
    });
  }

  getEmployeeById(id: string | number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  addEmployee(employee: Omit<Employee, 'id'>): Observable<any> {
    return this.http.post(this.apiUrl, employee, {
      headers: this.getHeaders()
    });
  }

  updateEmployee(id: string | number, employee: Partial<Employee>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, employee, {
      headers: this.getHeaders()
    });
  }

  deleteEmployee(id: string | number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}