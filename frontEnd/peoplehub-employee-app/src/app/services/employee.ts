import { Injectable } from '@angular/core';
import { Employee } from '../interfaces/employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private employees: Employee[] = [
    {
      id: 1,
      name: 'Sydney Sweeney',
      email: 'sydney.sweeney@peoplehub.com',
      department: 'HR',
      position: 'HR Director',
      phone: '+1 555-1001',
      joiningDate: '2020-01-15',
    },
    {
      id: 2,
      name: 'Ana de Armas',
      email: 'ana.armas@peoplehub.com',
      department: 'Marketing',
      position: 'Marketing Manager',
      phone: '+1 555-1002',
      joiningDate: '2021-03-18',
    },
    {
      id: 3,
      name: 'Taylor Swift',
      email: 'taylor.swift@peoplehub.com',
      department: 'Operations',
      position: 'Operations Lead',
      phone: '+1 555-1003',
      joiningDate: '2019-11-08',
    },
    {
      id: 4,
      name: 'Dani Daniels',
      email: 'dani.daniels@peoplehub.com',
      department: 'Finance',
      position: 'Financial Analyst',
      phone: '+1 555-1004',
      joiningDate: '2022-02-14',
    },
    {
      id: 5,
      name: 'Scarlett Johansson',
      email: 'scarlett.johansson@peoplehub.com',
      department: 'Engineering',
      position: 'Senior Software Engineer',
      phone: '+1 555-1005',
      joiningDate: '2018-06-20',
    },
    {
      id: 6,
      name: 'Emma Watson',
      email: 'emma.watson@peoplehub.com',
      department: 'HR',
      position: 'HR Business Partner',
      phone: '+1 555-1006',
      joiningDate: '2021-07-01',
    },
    {
      id: 7,
      name: 'Elizabeth Olsen',
      email: 'elizabeth.olsen@peoplehub.com',
      department: 'Engineering',
      position: 'Frontend Developer',
      phone: '+1 555-1007',
      joiningDate: '2023-01-10',
    },
    {
      id: 8,
      name: 'Rachel McAdams',
      email: 'rachel.mcadams@peoplehub.com',
      department: 'Marketing',
      position: 'Content Strategist',
      phone: '+1 555-1008',
      joiningDate: '2020-09-22',
    },
    {
      id: 9,
      name: 'Natalie Portman',
      email: 'natalie.portman@peoplehub.com',
      department: 'Finance',
      position: 'Finance Manager',
      phone: '+1 555-1009',
      joiningDate: '2019-05-17',
    },
    {
      id: 10,
      name: 'Anne Hathaway',
      email: 'anne.hathaway@peoplehub.com',
      department: 'Operations',
      position: 'Operations Manager',
      phone: '+1 555-1010',
      joiningDate: '2018-12-03',
    },
    {
      id: 11,
      name: 'Dakota Johnson',
      email: 'dakota.johnson@peoplehub.com',
      department: 'Marketing',
      position: 'Brand Manager',
      phone: '+1 555-1011',
      joiningDate: '2022-04-19',
    },
    {
      id: 12,
      name: 'Alexandra Daddario',
      email: 'alexandra.daddario@peoplehub.com',
      department: 'Engineering',
      position: 'UI/UX Designer',
      phone: '+1 555-1012',
      joiningDate: '2021-10-30',
    },
    {
      id: 13,
      name: 'Salma Hayek',
      email: 'salma.hayek@peoplehub.com',
      department: 'HR',
      position: 'Talent Acquisition Lead',
      phone: '+1 555-1013',
      joiningDate: '2019-02-11',
    },
    {
      id: 14,
      name: 'Jennifer Connelly',
      email: 'jennifer.connelly@peoplehub.com',
      department: 'Finance',
      position: 'Senior Accountant',
      phone: '+1 555-1014',
      joiningDate: '2020-08-05',
    },
    {
      id: 15,
      name: 'Margot Robbie',
      email: 'margot.robbie@peoplehub.com',
      department: 'Operations',
      position: 'Project Manager',
      phone: '+1 555-1015',
      joiningDate: '2021-12-13',
    },
    {
      id: 16,
      name: 'Johnny Depp',
      email: 'johnny.depp@peoplehub.com',
      department: 'Engineering',
      position: 'Tech Lead',
      phone: '+1 555-1016',
      joiningDate: '2017-04-24',
    },
    {
      id: 17,
      name: 'Jake Gyllenhaal',
      email: 'jake.gyllenhaal@peoplehub.com',
      department: 'Engineering',
      position: 'Backend Developer',
      phone: '+1 555-1017',
      joiningDate: '2022-06-09',
    },
    {
      id: 18,
      name: 'Ryan Reynolds',
      email: 'ryan.reynolds@peoplehub.com',
      department: 'Marketing',
      position: 'Creative Director',
      phone: '+1 555-1018',
      joiningDate: '2019-01-28',
    },
    {
      id: 19,
      name: 'Vin Diesel',
      email: 'vin.diesel@peoplehub.com',
      department: 'Operations',
      position: 'Logistics Coordinator',
      phone: '+1 555-1019',
      joiningDate: '2023-03-14',
    },
    {
      id: 20,
      name: 'Dwayne Johnson',
      email: 'dwayne.johnson@peoplehub.com',
      department: 'HR',
      position: 'People Operations Manager',
      phone: '+1 555-1020',
      joiningDate: '2018-10-18',
    },
    {
      id: 21,
      name: 'Chris Hemsworth',
      email: 'chris.hemsworth@peoplehub.com',
      department: 'Engineering',
      position: 'DevOps Engineer',
      phone: '+1 555-1021',
      joiningDate: '2020-02-26',
    },
    {
      id: 22,
      name: 'Keanu Reeves',
      email: 'keanu.reeves@peoplehub.com',
      department: 'Finance',
      position: 'Budget Analyst',
      phone: '+1 555-1022',
      joiningDate: '2021-11-15',
    },
    {
      id: 23,
      name: 'Tom Cruise',
      email: 'tom.cruise@peoplehub.com',
      department: 'Operations',
      position: 'Regional Operations Head',
      phone: '+1 555-1023',
      joiningDate: '2017-08-12',
    },
    {
      id: 24,
      name: 'Robert Downey Jr.',
      email: 'robert.downey@peoplehub.com',
      department: 'Engineering',
      position: 'Principal Engineer',
      phone: '+1 555-1024',
      joiningDate: '2016-09-07',
    },
    {
      id: 25,
      name: 'Leonardo DiCaprio',
      email: 'leonardo.dicaprio@peoplehub.com',
      department: 'Marketing',
      position: 'Marketing Director',
      phone: '+1 555-1025',
      joiningDate: '2018-05-30',
    },
  ];

  getEmployees(): Employee[] {
    return [...this.employees];
  }

  getEmployeeById(id: number): Employee | undefined {
    return this.employees.find(emp => emp.id === id);
  }

  addEmployee(employee: Omit<Employee, 'id'>): Employee {
    const newEmployee: Employee = {
      ...employee,
      id: Math.max(...this.employees.map(e => e.id)) + 1,
    };
    this.employees.push(newEmployee);
    return newEmployee;
  }

  updateEmployee(id: number, employee: Partial<Employee>): Employee | undefined {
    const index = this.employees.findIndex(emp => emp.id === id);
    if(index !== -1) {
      this.employees[index] = { ...this.employees[index], ...employee };
      return this.employees[index];
    }
    return undefined;
  }

  deleteEmployee(id: number): boolean {
    const index = this.employees.findIndex(emp => emp.id === id);
    if(index !== -1) {
      this.employees.splice(index, 1);
      return true;
    }
    return false;
  }
}