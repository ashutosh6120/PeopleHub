import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarCellRenderer } from './avatar-cell-renderer';

describe('AvatarCellRenderer', () => {
  let component: AvatarCellRenderer;
  let fixture: ComponentFixture<AvatarCellRenderer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarCellRenderer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvatarCellRenderer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
