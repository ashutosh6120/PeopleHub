import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsCellRenderer } from './actions-cell-renderer';

describe('ActionsCellRenderer', () => {
  let component: ActionsCellRenderer;
  let fixture: ComponentFixture<ActionsCellRenderer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionsCellRenderer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionsCellRenderer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
