import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Employee, EmployeeApiResponse, EmployeeListApiResponse } from '../interfaces/employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = 'http://localhost:5001/api/employees';

  constructor(private http: HttpClient) {}

  private getCurrentUser(): any {
    const globalUser = (window as any).__HR_PORTAL_USER__;
    if (globalUser) {
      return globalUser;
    }

    try {
      const storedUser = localStorage.getItem('hr_portal_user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  }

  private getAuthToken(): string {
    const user = this.getCurrentUser();
    return user?.token || '';
  }

  private mapEmployee(employee: EmployeeApiResponse): Employee {
    return {
      id: employee._id || employee.id || '',
      name: employee.name,
      email: employee.email,
      department: employee.department,
      position: employee.position,
      phone: employee.phone,
      joiningDate: employee.joiningDate,
    };
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.getAuthToken()}`,
    };
  }

  getEmployees(
    search?: string,
    page: number = 1,
    limit: number = 10,
  ): Observable<EmployeeListApiResponse & { employees: Employee[] }> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http
      .get<EmployeeListApiResponse>(this.apiUrl, {
        params,
        headers: this.getHeaders(),
      })
      .pipe(
        map((response: any) => ({
          ...response,
          employees: response.employees.map((employee: any) => this.mapEmployee(employee)),
        })),
      );
  }

  getEmployeeById(id: string | number): Observable<Employee> {
    return this.http
      .get<EmployeeApiResponse>(`${this.apiUrl}/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(map((employee) => this.mapEmployee(employee)));
  }

  addEmployee(employee: Omit<Employee, 'id'>): Observable<any> {
    return this.http.post<any>(this.apiUrl, employee, {
      headers: this.getHeaders(),
    });
  }

  updateEmployee(id: string | number, employee: Partial<Employee>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, employee, {
      headers: this.getHeaders(),
    });
  }

  deleteEmployee(id: string | number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
