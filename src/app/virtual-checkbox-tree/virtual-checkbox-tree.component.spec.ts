import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualCheckboxTreeComponent } from './virtual-checkbox-tree.component';

describe('VirtualCheckboxTreeComponent', () => {
  let component: VirtualCheckboxTreeComponent;
  let fixture: ComponentFixture<VirtualCheckboxTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VirtualCheckboxTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualCheckboxTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
