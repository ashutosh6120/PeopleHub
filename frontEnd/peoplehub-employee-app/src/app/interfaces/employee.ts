export interface Employee {
    id: number;
    name: string;
    email: string;
    department: 'HR' | 'Engineering' | 'Finance' | 'Marketing' | 'Operations',
    position: string;
    phone: string;
    joiningDate: string;
}
