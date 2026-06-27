import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentCellRenderer } from './department-cell-renderer';

describe('DepartmentCellRenderer', () => {
  let component: DepartmentCellRenderer;
  let fixture: ComponentFixture<DepartmentCellRenderer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentCellRenderer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentCellRenderer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
