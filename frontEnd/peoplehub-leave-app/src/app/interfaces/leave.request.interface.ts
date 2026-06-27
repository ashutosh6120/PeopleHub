export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export type LeaveType = 'Sick Leave' | 'Casual Leave' | 'Earned Leave';

export type BackendLeaveType = 'Sick' | 'Casual' | 'Earned';

export interface LeaveRequest {
  id: string | number;
  employeeId: string | number;
  employeeName: string;
  employeeInitials: string;
  avatarColor: string;
  type: LeaveType;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
}

export interface NewLeaveRequestInput {
  employeeId: string | number;
  employeeName: string;
  employeeInitials: string;
  avatarColor: string;
  type: LeaveType;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
}

export interface EmployeeLeaveProfile {
  employeeId: string | number;
  employeeName: string;
  employeeInitials: string;
  avatarColor: string;
}

export interface LeaveBalanceItem {
  type: LeaveType;
  remaining: number;
  total: number;
  progressPct: number;
}

export interface LeaveApiEmployee {
  _id?: string;
  id?: string;
  name: string;
  email?: string;
  department?: string;
}

export interface LeaveApiResponse {
  _id: string;
  employee: LeaveApiEmployee;
  leaveType: BackendLeaveType;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  reason: string;
  status: LeaveStatus;
}

export interface EmployeeApiResponse {
  _id: string;
  name: string;
}

export interface EmployeeListApiResponse {
  employees: EmployeeApiResponse[];
}

export interface LeaveListApiResponse {
  leaves: LeaveApiResponse[];
}

export interface LeaveBalanceApiResponse {
  balance: Record<BackendLeaveType, number>;
  entitlements: Record<BackendLeaveType, number>;
}
