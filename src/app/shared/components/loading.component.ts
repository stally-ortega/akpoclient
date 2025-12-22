import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../core/services/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="loadingService.isLoading()" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-sm transition-opacity duration-300 overflow-hidden perspective-container">
      
      <!-- Screen Flash Overlay -->
      <div class="absolute inset-0 z-40 bg-white pointer-events-none flash-overlay"></div>

      <!-- Full Screen Beam Container -->
      <!-- Independent of Lighthouse Container for full screen coverage -->
      <!-- Origin set to match Lighthouse Bulb position: Center - 84px (Top of tower) -->
      <!-- We align the container exactly so the beam originates from the bulb -->
      <div class="absolute w-full h-[200vh] pointer-events-none z-20 flex justify-center items-start"
           style="top: calc(50% - 84px); transform-style: preserve-3d;">
           
           <div class="lighthouse-beam"></div>
      </div>

      <!-- Lighthouse Container (Centered) -->
      <div class="relative w-[300px] h-[300px] flex flex-col items-center justify-center z-30">
        
        <!-- SVG Lighthouse -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" 
             class="w-full h-full text-sky-500 drop-shadow-[0_0_10px_rgba(56,189,248,0.3)] mb-4"
             style="stroke-linecap: round; stroke-linejoin: round; fill: none;">
           
           <!-- Base Foundation -->
           <path stroke="currentColor" stroke-width="2" d="M25,95 L75,95 L70,85 L30,85 Z" />
           
           <!-- Tower (Tapered Geometric) -->
           <path stroke="currentColor" stroke-width="2" d="M32,85 L40,35 L60,35 L68,85" />
           
           <!-- Tower Details (Horizontal Bands/Windows) -->
           <line x1="34" y1="70" x2="66" y2="70" stroke="currentColor" stroke-width="1" opacity="0.5" />
           <line x1="36" y1="55" x2="64" y2="55" stroke="currentColor" stroke-width="1" opacity="0.5" />
           <rect x="47" y="60" width="6" height="8" rx="1" stroke="currentColor" stroke-width="1.5" />

           <!-- Gallery Deck (Balcony) -->
           <path stroke="currentColor" stroke-width="2.5" d="M35,35 L65,35" />
           <path stroke="currentColor" stroke-width="1" d="M35,35 L35,32 L65,32 L65,35" />
           
           <!-- Lantern Room (The Glass Housing) -->
           <rect x="42" y="18" width="16" height="17" stroke="currentColor" stroke-width="1.5" />
           <line x1="42" y1="18" x2="58" y2="35" stroke="currentColor" stroke-width="0.5" /> <!-- Cross bracing -->
           <line x1="58" y1="18" x2="42" y2="35" stroke="currentColor" stroke-width="0.5" />
           
           <!-- Dome Roof -->
           <path stroke="currentColor" stroke-width="2" d="M40,18 Q50,5 60,18" />
           <line x1="50" y1="11" x2="50" y2="5" stroke="currentColor" stroke-width="1.5" /> <!-- Antenna/Lightning rod -->
           
           <!-- The Bulb (Kept at cy=22 to match beam pivot) -->
           <circle cx="50" cy="22" r="3" fill="white" stroke="none" class="lighthouse-bulb" />
        </svg>

        <div class="text-white/80 font-mono text-sm tracking-widest animate-pulse">CARGANDO...</div>

      </div>

      <!-- Error Message -->
      <div *ngIf="loadingService.showError()" 
           class="absolute bottom-10 z-[60] left-0 right-0 mx-auto w-full max-w-md p-4 bg-red-900/90 border border-red-500 rounded-lg text-white text-center shadow-lg animate-bounce animate-duration-1000">
        <p class="font-bold text-lg">⚠️ Ha ocurrido un error</p>
        <p class="text-sm opacity-90">El sistema está tardando demasiado. Por favor verifique la consola del navegador.</p>
      </div>

    </div>
  `,
  styles: [`
    .perspective-container {
      perspective: 1200px;
      perspective-origin: 50% 50%;
    }

    .flash-overlay {
      opacity: 0;
      animation: blindingFlash 4s ease-in-out infinite;
    }

    .lighthouse-bulb {
      transform-origin: 50% 22%; 
      transform-box: fill-box;
      animation: bulbFlare 4s ease-in-out infinite;
    }

    .lighthouse-beam {
      /* Version 1: Fan / Triangle Shape */
      width: 300vw; 
      height: 100%; 
      
      /* 
         SOFT TRANSPARENCY GRADIENT
         Instead of solid white/yellow, we use very low alpha values.
      */
      background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.8) 0%,   /* Core (Bulb) - Bright but not solid */
        rgba(253, 224, 71, 0.2) 40%,   /* Beam Body - Very Transparent Yellow */
        rgba(253, 224, 71, 0.0) 100%   /* Bottom - Completely transparent */
      );

      clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
      
      /* 'screen' blend mode allows background to show through, creating true transparency feel */
      mix-blend-mode: screen; 
      opacity: 0.9;

      /* Radial Mask to soften the side edges of the fan */
      mask-image: radial-gradient(circle at 50% 0%, black 20%, transparent 70%);

      transform-origin: 50% 0%; 
      animation: rightToLeftSweep 4s ease-in-out infinite;
    }

    @keyframes rightToLeftSweep {
      /* Direction: Right -> Left (Version 1) */
      0% {
        transform: rotateY(-95deg); 
        opacity: 0;
      }
      20% { opacity: 1; }
      50% {
        transform: rotateY(0deg); 
        opacity: 1;
      }
      80% { opacity: 1; }
      100% {
        transform: rotateY(95deg); 
        opacity: 0;
      }
    }

    @keyframes blindingFlash {
      0%, 40% { opacity: 0; }
      50% { opacity: 0.8; } /* Slightly softer flash for transparency theme */
      60%, 100% { opacity: 0; }
    }

    @keyframes bulbFlare {
      0%, 40% { transform: scale(1); }
      50% { 
        transform: scale(20); 
        fill: #fff;
        filter: drop-shadow(0 0 60px white);
      }
      60%, 100% { transform: scale(1); }
    }
  `]
})
export class LoadingComponent {
  loadingService = inject(LoadingService);
}
