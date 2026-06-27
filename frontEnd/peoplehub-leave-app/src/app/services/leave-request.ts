import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  BackendLeaveType,
  EmployeeLeaveProfile,
  LeaveApiResponse,
  LeaveBalanceItem,
  LeaveRequest,
  LeaveStatus,
  LeaveType,
  NewLeaveRequestInput,
} from '../interfaces/leave.request.interface';

@Injectable({
  providedIn: 'root',
})
export class LeaveRequestService {
  private leaveApiUrl = 'http://localhost:5001/api/leaves';
  private employeeApiUrl = 'http://localhost:5001/api/employees';

  constructor(private http: HttpClient) {}

  private getAuthToken(): string {
    const user = (window as Window & { __HR_PORTAL_USER__?: { token?: string } })
      .__HR_PORTAL_USER__;
    return user?.token || '';
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.getAuthToken()}`,
    };
  }

  private getInitials(name: string): string {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }

  private getAvatarColor(name: string): string {
    const colors = ['#0f8a7d', '#7e22ce', '#dc2626', '#f97316', '#2e7d32', '#db2777', '#1976D2'];
    return colors[name.charCodeAt(0) % colors.length];
  }

  private toFrontendLeaveType(type: BackendLeaveType): LeaveType {
    const typeMap: Record<BackendLeaveType, LeaveType> = {
      Sick: 'Sick Leave',
      Casual: 'Casual Leave',
      Earned: 'Earned Leave',
    };

    return typeMap[type];
  }

  private toBackendLeaveType(type: LeaveType): BackendLeaveType {
    const typeMap: Record<LeaveType, BackendLeaveType> = {
      'Sick Leave': 'Sick',
      'Casual Leave': 'Casual',
      'Earned Leave': 'Earned',
    };

    return typeMap[type];
  }

  private mapLeaveRequest(leave: LeaveApiResponse): LeaveRequest {
    const employeeName = leave.employee?.name || 'Unknown Employee';

    return {
      id: leave._id,
      employeeId: leave.employee?._id || leave.employee?.id || '',
      employeeName,
      employeeInitials: this.getInitials(employeeName),
      avatarColor: this.getAvatarColor(employeeName),
      type: this.toFrontendLeaveType(leave.leaveType),
      fromDate: leave.startDate,
      toDate: leave.endDate,
      days: leave.numberOfDays,
      reason: leave.reason,
      status: leave.status,
    };
  }

  getRequests(
    status?: LeaveStatus,
    employeeId?: string | number,
    page: number = 1,
    limit: number = 100,
  ): Observable<LeaveRequest[]> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    if (status) {
      params = params.set('status', status);
    }

    if (employeeId) {
      params = params.set('employeeId', String(employeeId));
    }

    return this.http
      .get(this.leaveApiUrl, {
        params,
        headers: this.getHeaders(),
      })
      .pipe(
        map((response: any) => response.leaves.map((leave: any) => this.mapLeaveRequest(leave))),
      );
  }

  addRequest(input: NewLeaveRequestInput): Observable<LeaveRequest> {
    return this.http
      .post<{ leave: LeaveApiResponse }>(
        this.leaveApiUrl,
        {
          employeeId: input.employeeId,
          leaveType: this.toBackendLeaveType(input.type),
          startDate: input.fromDate,
          endDate: input.toDate,
          numberOfDays: input.days,
          reason: input.reason,
        },
        {
          headers: this.getHeaders(),
        },
      )
      .pipe(map((response) => this.mapLeaveRequest(response.leave)));
  }

  getEmployeeProfileByName(name: string): Observable<EmployeeLeaveProfile> {
    const params = new HttpParams().set('search', name).set('page', '1').set('limit', '100');

    return this.http
      .get(this.employeeApiUrl, {
        params,
        headers: this.getHeaders(),
      })
      .pipe(
        map((response: any) => {
          const matchedEmployee =
            response.employees.find(
              (employee: any) => employee.name.toLowerCase() === name.toLowerCase(),
            ) || response.employees[0];

          return {
            employeeId: matchedEmployee?._id || '',
            employeeName: matchedEmployee?.name || name,
            employeeInitials: this.getInitials(matchedEmployee?.name || name),
            avatarColor: this.getAvatarColor(matchedEmployee?.name || name),
          };
        }),
      );
  }

  updateStatus(id: string | number, status: LeaveStatus): Observable<LeaveRequest> {
    return this.http
      .put<{ leave: LeaveApiResponse }>(
        `${this.leaveApiUrl}/${id}`,
        {
          status,
        },
        {
          headers: this.getHeaders(),
        },
      )
      .pipe(map((response) => this.mapLeaveRequest(response.leave)));
  }

  getLeaveBalance(employeeId: string | number): Observable<LeaveBalanceItem[]> {
    return this.http
      .get(`${this.leaveApiUrl}/balance/${employeeId}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((response: any) =>
          (Object.keys(response.entitlements) as BackendLeaveType[]).map((type) => {
            const total = response.entitlements[type];
            const remaining = response.balance[type] ?? total;

            return {
              type: this.toFrontendLeaveType(type),
              remaining,
              total,
              progressPct: total > 0 ? Math.round((remaining / total) * 100) : 0,
            };
          }),
        ),
      );
  }
}
