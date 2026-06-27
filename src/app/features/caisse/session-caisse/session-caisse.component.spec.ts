import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionCaisseComponent } from './session-caisse.component';

describe('SessionCaisseComponent', () => {
  let component: SessionCaisseComponent;
  let fixture: ComponentFixture<SessionCaisseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionCaisseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionCaisseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});