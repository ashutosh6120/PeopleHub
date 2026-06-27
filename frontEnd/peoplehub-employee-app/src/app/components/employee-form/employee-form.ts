import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Employee } from '../../interfaces/employee';
import { EmployeeService } from '../../services/employee';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-employee-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.scss',
})
export class EmployeeForm implements OnInit{
  isEditMode = false;
  employeeId: number | null = null;
  departments: string[] = ['HR', 'Engineering', 'Finance', 'Marketing', 'Operations'];

  formData = {
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '' as Employee['department'] | '',
    joiningDate: '',
  };

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if(id) {
      this.isEditMode = true;
      this.employeeId = +id;
      const employee = this.employeeService.getEmployeeById(this.employeeId);
      if(employee) {
        this.formData = {
          name: employee.name,
          email: employee.email,
          phone: employee.phone,
          position: employee.position,
          department: employee.department,
          joiningDate: employee.joiningDate,
        };
      }
    }
  }

  onSave() {
    if(!this.formData.name || !this.formData.email || !this.formData.department) {
      return;
    }

    if(this.isEditMode && this.employeeId) {
      this.employeeService.updateEmployee(this.employeeId, this.formData as Partial<Employee>);
    } else {
      this.employeeService.addEmployee(this.formData as Omit<Employee, 'id'>);
    }
    this.router.navigate(['/']);
  }

  onCancel() {
    this.router.navigate(['/']);
  }
}
