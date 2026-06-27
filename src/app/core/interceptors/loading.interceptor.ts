import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private pendingRequests = 0;

  constructor(private loadingService: LoadingService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.incrementLoader();
    return next.handle(req).pipe(
      finalize(() => {
        this.decrementLoader();
      })
    );
  }

  private incrementLoader(): void {
    this.pendingRequests++;
    if (this.pendingRequests === 1) {
      this.loadingService.show();
    }
  }

  private decrementLoader(): void {
    this.pendingRequests--;
    if (this.pendingRequests === 0) {
      this.loadingService.hide();
    }
  }
}