import { Component, ViewEncapsulation } from '@angular/core';
import { ActionsCellRenderer } from './cell-renderers/actions-cell-renderer/actions-cell-renderer';
import { DepartmentCellRenderer } from './cell-renderers/department-cell-renderer/department-cell-renderer';
import { AvatarCellRenderer } from './cell-renderers/avatar-cell-renderer/avatar-cell-renderer';
import { EmployeeService } from '../../services/employee';
import { Router } from '@angular/router';
import { ColDef, themeQuartz } from 'ag-grid-community';
import { Employee } from '../../interfaces/employee';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { DeleteConfirmDialog } from '../delete-confirm-dialog/delete-confirm-dialog';

@Component({
  selector: 'app-employee-list',
  imports: [CommonModule, FormsModule, AgGridAngular, DeleteConfirmDialog],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.scss',
  encapsulation: ViewEncapsulation.None,
})
export class EmployeeList {
  employees: Employee[] = [];
  searchTerm = '';
  isAdmin = false;

  columnDefs: ColDef[] = [];
  defaultColDef: ColDef = {
    sortable: true,
    filter: false,
    resizable: true,
    minWidth: 200,
  };
  theme = themeQuartz.withParams({ accentColor: '#1976D2' });

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = (window as any).__HR_PORTAL_USER__;
    this.isAdmin = user?.role === 'Admin';
    this.setupColumns();
    this.loadEmployees();
  }

  setupColumns(): void {
    this.columnDefs = [
      {
        headerName: 'NAME',
        field: 'name',
        cellRenderer: AvatarCellRenderer,
      },
      { headerName: 'EMAIL', field: 'email' },
      {
        headerName: 'DEPARTMENT',
        field: 'department',
        cellRenderer: DepartmentCellRenderer,
      },
      { headerName: 'POSITION', field: 'position' },
      { headerName: 'PHONE', field: 'phone' },
      {
        headerName: 'JOINING DATE',
        field: 'joiningDate',
        valueFormatter: (params) => {
          const date = new Date(params.value);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        },
      },
      {
        headerName: 'ACTIONS',
        field: 'id',
        sortable: false,
        filter: false,
        minWidth: 250,
        flex: 1,
        cellRenderer: ActionsCellRenderer,
      },
    ];
  }

  loadEmployees(): void {
    this.employees = this.employeeService.getEmployees();
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase();
    if (!term) {
      this.employees = this.employeeService.getEmployees();
    } else {
      this.employees = this.employeeService.getEmployees().filter(emp =>
        emp.name.toLowerCase().includes(term) ||
        emp.department.toLowerCase().includes(term) ||
        emp.email.toLowerCase().includes(term) ||
        emp.position.toLowerCase().includes(term)
      );
    }
  }

  onAdd(): void {
    this.router.navigate(['/add']);
  }

  onConfirmDelete(employeeId: number): void {
    this.employeeService.deleteEmployee(employeeId);
    this.loadEmployees();
  }
}
