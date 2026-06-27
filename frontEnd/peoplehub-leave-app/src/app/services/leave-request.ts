import { Injectable } from "@angular/core";
import { LeaveRequest, LeaveStatus, NewLeaveRequestInput } from "../interfaces/leave.request.interface";

@Injectable({
  providedIn: 'root',
})
export class LeaveRequestService {
  private requests: LeaveRequest[] = [
    {
      id: 1,
      employeeId: 2,
      employeeName: 'James Chen',
      employeeInitials: 'JC',
      avatarColor: '#0f8a7d',
      type: 'Sick Leave',
      fromDate: '2024-06-10',
      toDate: '2024-06-11',
      days: 2,
      reason: 'Fever and cold',
      status: 'Approved',
    },
    {
      id: 2,
      employeeId: 2,
      employeeName: 'James Chen',
      employeeInitials: 'JC',
      avatarColor: '#0f8a7d',
      type: 'Casual Leave',
      fromDate: '2024-07-04',
      toDate: '2024-07-05',
      days: 2,
      reason: 'Family event',
      status: 'Approved',
    },
    {
      id: 3,
      employeeId: 2,
      employeeName: 'James Chen',
      employeeInitials: 'JC',
      avatarColor: '#0f8a7d',
      type: 'Earned Leave',
      fromDate: '2024-08-20',
      toDate: '2024-08-25',
      days: 6,
      reason: 'Annual vacation',
      status: 'Approved',
    },
    {
      id: 4,
      employeeId: 3,
      employeeName: 'Priya Sharma',
      employeeInitials: 'PS',
      avatarColor: '#7e22ce',
      type: 'Sick Leave',
      fromDate: '2024-06-15',
      toDate: '2024-06-15',
      days: 1,
      reason: 'Doctor appointment',
      status: 'Approved',
    },
    {
      id: 5,
      employeeId: 3,
      employeeName: 'Priya Sharma',
      employeeInitials: 'PS',
      avatarColor: '#7e22ce',
      type: 'Casual Leave',
      fromDate: '2024-07-20',
      toDate: '2024-07-21',
      days: 2,
      reason: 'Personal work',
      status: 'Rejected',
    },
    {
      id: 6,
      employeeId: 4,
      employeeName: 'Marcus Thompson',
      employeeInitials: 'MT',
      avatarColor: '#dc2626',
      type: 'Earned Leave',
      fromDate: '2024-08-01',
      toDate: '2024-08-07',
      days: 5,
      reason: 'Family trip to Europe',
      status: 'Pending',
    },
    {
      id: 7,
      employeeId: 5,
      employeeName: 'Aisha Patel',
      employeeInitials: 'AP',
      avatarColor: '#f97316',
      type: 'Sick Leave',
      fromDate: '2024-09-03',
      toDate: '2024-09-04',
      days: 2,
      reason: 'Medical procedure recovery',
      status: 'Pending',
    },
    {
      id: 8,
      employeeId: 6,
      employeeName: 'David Kim',
      employeeInitials: 'DK',
      avatarColor: '#2e7d32',
      type: 'Casual Leave',
      fromDate: '2024-07-15',
      toDate: '2024-07-15',
      days: 1,
      reason: 'Bank work',
      status: 'Approved',
    },
    {
      id: 9,
      employeeId: 7,
      employeeName: 'Elena Russo',
      employeeInitials: 'ER',
      avatarColor: '#db2777',
      type: 'Earned Leave',
      fromDate: '2024-08-12',
      toDate: '2024-08-16',
      days: 5,
      reason: 'Wedding anniversary trip',
      status: 'Approved',
    },
    {
      id: 10,
      employeeId: 8,
      employeeName: 'Carlos Mendez',
      employeeInitials: 'CM',
      avatarColor: '#1976D2',
      type: 'Sick Leave',
      fromDate: '2024-07-22',
      toDate: '2024-07-22',
      days: 1,
      reason: 'Dental surgery',
      status: 'Approved',
    },
  ];

  getRequests(): LeaveRequest[] {
    return this.requests.map((item) => ({ ...item }));
  }

  addRequest(input: NewLeaveRequestInput): void {
    const nextId = this.requests.length > 0 ? Math.max(...this.requests.map((item) => item.id)) + 1 : 1;
    this.requests.unshift({
      id: nextId,
      employeeId: input.employeeId,
      employeeName: input.employeeName,
      employeeInitials: input.employeeInitials,
      avatarColor: input.avatarColor,
      type: input.type,
      fromDate: input.fromDate,
      toDate: input.toDate,
      days: input.days,
      reason: input.reason,
      status: 'Pending',
    });
  }

  getEmployeeProfileByName(name: string): {
    employeeId: number;
    employeeName: string;
    employeeInitials: string;
    avatarColor: string;
  } {
    const existing = this.requests.find((item) => item.employeeName === name);
    if (existing) {
      return {
        employeeId: existing.employeeId,
        employeeName: existing.employeeName,
        employeeInitials: existing.employeeInitials,
        avatarColor: existing.avatarColor,
      };
    }

    const initials = name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();

    return {
      employeeId: 999,
      employeeName: name,
      employeeInitials: initials,
      avatarColor: '#1976D2',
    };
  }

  updateStatus(id: number, status: LeaveStatus): void {
    const target = this.requests.find((item) => item.id === id);
    if (target) {
      target.status = status;
    }
  }
}