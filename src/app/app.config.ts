import { importProvidersFrom } from '@angular/core';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { LucideAngularModule, LayoutDashboard, Monitor, Mail, FileText, Package, Keyboard, Mouse, HardDrive, Headphones, X, User, Calendar, Tag, Activity, Clock, Plus, Trash, CheckSquare, CheckCircle, ChevronRight, Check, Search, Download, Bell, Briefcase, Settings, Sun, Moon } from 'lucide-angular';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideAnimations(),
    provideToastr({
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, errorInterceptor, loadingInterceptor])
    ),
    importProvidersFrom(LucideAngularModule.pick({ 
      LayoutDashboard, 
      Monitor, 
      Mail, 
      FileText, 
      Package, 
      Keyboard, 
      Mouse, 
      HardDrive, 
      Headphones,
      X,
      User,
      Calendar,
      Tag,
      Activity,
      Clock,
      Plus,
      Trash,
      CheckSquare,
      CheckCircle,
      ChevronRight,
      Check,
      Search,
      Download,
      Bell,
      Briefcase,
      Settings,
      Sun,
      Moon
    }))
  ]
};
