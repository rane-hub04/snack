import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionDesMenusComponent } from './gestion-des-menus.component';

describe('GestionDesMenusComponent', () => {
  let component: GestionDesMenusComponent;
  let fixture: ComponentFixture<GestionDesMenusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionDesMenusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionDesMenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});