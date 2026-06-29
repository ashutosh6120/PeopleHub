export interface Employee {
    id: string | number;
    name: string;
    email: string;
    department: 'HR' | 'Engineering' | 'Finance' | 'Marketing' | 'Operations',
    position: string;
    phone: string;
    joiningDate: string;
}

export interface EmployeeApiResponse {
  _id?: string;
  id?: string | number;
  name: string;
  email: string;
  department: Employee['department'];
  position: string;
  phone: string;
  joiningDate: string;
}

export interface EmployeeListApiResponse {
  employees: EmployeeApiResponse[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}