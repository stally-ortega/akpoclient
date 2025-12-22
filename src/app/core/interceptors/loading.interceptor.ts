import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  
  // Skip loading for specific silent calls if needed (e.g. background polling)
  // For now, only show for non-silent request. 
  // Let's assume all calls show loading unless specified.
  
  loadingService.show();

  return next(req).pipe(
    finalize(() => loadingService.hide())
  );
};
