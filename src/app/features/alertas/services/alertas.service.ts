import { Injectable, signal, computed, inject } from '@angular/core';
import { AlertConfig } from '../models/alertas.models';
import { interval } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { PrestamosService } from '../../prestamos/services/prestamos.service';
import { InventarioService } from '../../inventario/services/inventario.service';
import { ActasService } from '../../actas/services/actas.service';

import { RuleEvaluatorService } from './rule-evaluator.service';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {
  private toast = inject(ToastrService);
  private prestamosService = inject(PrestamosService);
  private inventarioService = inject(InventarioService);
  private actasService = inject(ActasService);
  private evaluator = inject(RuleEvaluatorService);

  // State
  private _alertas = signal<AlertConfig[]>([]);
  
  // Public signal
  public alertas = computed(() => this._alertas());

  constructor() {
    this.loadInitialAlerts();
    this.startMonitoring();
  }

  private loadInitialAlerts() {
    // Default alerts (mocked for now, implies persistence later)
    const defaults: AlertConfig[] = [
      {
        id: '1',
        nombre: 'Cierre de Préstamos',
        mensaje: 'Hay préstamos activos pendientes de devolución.',
        modulo: 'PRESTAMOS',
        tipo: 'GENERAL',
        horaInicio: '16:00',
        activo: true,
        rootRule: {
          operator: 'AND',
          rules: [
            { field: 'prestamosActivos', operator: 'GT', value: 0 }
          ]
        }
      }
    ];
    this._alertas.set(defaults);
  }

  getAlerta(id: string): AlertConfig | undefined {
    return this._alertas().find(a => a.id === id);
  }

  addAlerta(alerta: Omit<AlertConfig, 'id'>) {
    const newAlerta: AlertConfig = {
      ...alerta,
      id: crypto.randomUUID()
    };
    this._alertas.update(current => [...current, newAlerta]);
    this.toast.success('Alerta creada correctamente');
  }

  updateAlerta(id: string, updates: Partial<AlertConfig>) {
    this._alertas.update(current => 
      current.map(a => a.id === id ? { ...a, ...updates } : a)
    );
    this.toast.info('Alerta actualizada');
  }

  deleteAlerta(id: string) {
    this._alertas.update(current => current.filter(a => a.id !== id));
    this.toast.info('Alerta eliminada');
  }

  toggleAlerta(id: string) {
    this._alertas.update(current => 
      current.map(a => a.id === id ? { ...a, activo: !a.activo } : a)
    );
  }

  // --- Monitoring Logic ---

  private startMonitoring() {
    interval(60000).subscribe(() => this.checkAlerts());
  }

  private checkAlerts() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    this._alertas().forEach(alerta => {
      if (!alerta.activo) return;

      const [hora, minuto] = alerta.horaInicio.split(':').map(Number);
      
      // Time Trigger
      if (currentHour > hora || (currentHour === hora && currentMinute >= minuto)) {
        
        let context: any[] = [];
        
        // Context Selection Strategy
        if (alerta.modulo === 'PRESTAMOS') {
           context = this.prestamosService.prestamos(); // Real Signal Data
        } else if (alerta.modulo === 'INVENTARIO') {
           // Mocked collection until InventarioService exposes signal
            context = [
              { serial: 'PC01', marca: 'Dell', estado: 'ASIGNADO' },
              { serial: 'PC02', marca: 'HP', estado: 'DISPONIBLE' }
            ]; 
        } else if (alerta.modulo === 'ACTAS') {
            // Mocked collection
            context = [
              { tipoActa: 'ASIGNACION', estado: 'PENDIENTE' }
            ];
        }

        // 2. Evaluate Rule & Quantitative Thresholds
        const matches = this.evaluator.findAllMatches(alerta.rootRule, context);
        const count = matches.length;
        
        let isTriggered = false;

        if (alerta.triggerCondition) {
          // Quantitative Mode
          const { operator, value } = alerta.triggerCondition;
          switch (operator) {
            case 'GT': isTriggered = count > value; break;
            case 'LT': isTriggered = count < value; break;
            case 'GTE': isTriggered = count >= value; break;
            case 'LTE': isTriggered = count <= value; break;
            case 'EQ': isTriggered = count === value; break;
          }
        } else {
          // Default Mode (Existence)
          isTriggered = count > 0;
        }

        if (isTriggered) {
          // Enhanced Notification
          const msg = alerta.triggerCondition 
            ? `${alerta.mensaje} (Detectados: ${count})` 
            : alerta.mensaje;
            
          this.triggerNotification(alerta, msg);
        }
      }
    });
  }

  // gatherContext is deprecated/removed in favor of local context selection
  private triggerNotification(alerta: AlertConfig, detail: string) {
     this.toast.warning(
        detail,
        alerta.nombre,
        { timeOut: 10000 }
     );
  }
}
