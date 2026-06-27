import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-department-cell-renderer',
  imports: [],
  templateUrl: './department-cell-renderer.html',
  styleUrl: './department-cell-renderer.scss',
})
export class DepartmentCellRenderer implements ICellRendererAngularComp{
  department = '';
  backgroundColor = '';
  textColor = '';

  agInit(params: ICellRendererParams) {
    this.department = params.value;
    const colorMap: Record<string, {bg: string; text: string}> = {
      HR: { bg: '#e3f2fd', text: '#1976D2' },
      Engineering: { bg: '#e8f5e9', text: '#388E3C' },
      Finance: { bg: '#fff3e0', text: '#F57C00' },
      Marketing: { bg: '#fce4ec', text: '#C2185B' },
      Operations: { bg: '#f3e5f5', text: '#7B1FA2' },
    };
    const colors = colorMap[this.department] || {bg: 'f5f5f5', text: '#333' };
    this.backgroundColor = colors.bg;
    this.textColor = colors.text;
  }

  refresh() {
    return false;
  }
}
