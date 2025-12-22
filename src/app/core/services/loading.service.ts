import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _loading = signal<boolean>(false);
  private _showError = signal<boolean>(false);
  
  // Timeout reference
  private timeoutRef: any;
  private readonly TIMEOUT_MS = 10000; // 10 seconds before showing error

  isLoading = computed(() => this._loading());
  showError = computed(() => this._showError());

  show() {
    this._loading.set(true);
    this._showError.set(false);
    
    // Clear existing timeout
    if (this.timeoutRef) clearTimeout(this.timeoutRef);

    // Start new timeout
    this.timeoutRef = setTimeout(() => {
      if (this._loading()) {
        this._showError.set(true);
      }
    }, this.TIMEOUT_MS);
  }

  hide() {
    this._loading.set(false);
    if (this.timeoutRef) {
      clearTimeout(this.timeoutRef);
      this.timeoutRef = null;
    }
    // We do NOT clear showError automatically on hide, user might want to see the error?
    // Actually user said "always visible until reload". So once true, stays true.
  }
}
