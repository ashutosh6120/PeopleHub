import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-avatar-cell-renderer',
  imports: [],
  templateUrl: './avatar-cell-renderer.html',
  styleUrl: './avatar-cell-renderer.scss',
})
export class AvatarCellRenderer implements ICellRendererAngularComp{
  name = '';
  initials = '';
  avatarColor = '';

  agInit(params: ICellRendererParams) {
    this.name = params.value;
    const colors = ['#1976d2', '#388e3c', '#f57c00', '#7b1fa2', '#d32f2f', '#00796b'];
    this.avatarColor = colors[this.name.charCodeAt(0) % colors.length];
    this.initials = this.name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
  }

  refresh() {
    return false;
  }
}
