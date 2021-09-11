import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TristateCheckboxComponent } from './tristate-checkbox.component';

describe('TristateCheckboxComponent', () => {
  let component: TristateCheckboxComponent;
  let fixture: ComponentFixture<TristateCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TristateCheckboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TristateCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
