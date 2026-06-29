import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminDashboardComponent } from './admin/admin-dashboard.component';
import { routes } from './app.routes';

describe('app routes', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), AdminDashboardComponent]
    }).compileComponents();
  });

  it('redirects the root path to the admin dashboard', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('');
    expect(router.url).toBe('/admin/dashboard');
  });
});
