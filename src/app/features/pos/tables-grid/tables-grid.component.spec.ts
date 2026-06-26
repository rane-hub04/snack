import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablesGridComponent } from './tables-grid.component';

describe('TablesGridComponent', () => {
  let component: TablesGridComponent;
  let fixture: ComponentFixture<TablesGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablesGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablesGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});