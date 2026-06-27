import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // First check if the user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    // Get the expected role from the route data
    const expectedRole = route.data['expectedRole'] as string | string[];
    if (!expectedRole) {
      // No role restriction, allow access
      return true;
    }

    // Convert to array if it's a string
    const expectedRoles = Array.isArray(expectedRole) ? expectedRole : [expectedRole];

    // Check if the user's role is in the allowed roles
    const userRole = this.authService.role();
    if (userRole && expectedRoles.includes(userRole)) {
      return true;
    } else {
      // Redirect to the default page for the user's role
      const redirectUrl = this.authService.getDefaultRoute();
      this.router.navigate([redirectUrl]);
      return false;
    }
  }
}