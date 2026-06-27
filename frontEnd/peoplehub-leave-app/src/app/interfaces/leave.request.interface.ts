export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
    id: number;
    employeeId: number;
    employeeName: string;
    employeeInitials: string;
    avatarColor: string;
    type: string;
    fromDate: string;
    toDate: string;
    days: number;
    reason: string;
    status: LeaveStatus;
}

export interface NewLeaveRequestInput {
    employeeId: number;
    employeeName: string;
    employeeInitials: string;
    avatarColor: string;
    type: string;
    fromDate: string;
    toDate: string;
    days: number;
    reason: string;
}
