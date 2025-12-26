import { z } from 'zod';

export const CatalogoSchema = z.object({
  id: z.number().int().positive(),
  nombre: z.string().min(1)
});

export const UbicacionSchema = CatalogoSchema.extend({
  tipo: z.enum(['oficina', 'bodega', 'home_office', 'cliente'])
});

export const ProyectoSchema = CatalogoSchema.extend({
  cliente: z.string().optional(),
  codigo: z.string().optional()
});

export const UsuarioAdSchema = z.object({
  id: z.string().optional(),
  usuarioAd: z.string().email(),
  nombre: z.string().min(1),
  cargo: z.string().optional(),
  departamento: z.string().optional()
});

export const ActivoSchema = z.object({
  serial: z.string().min(3).regex(/^[A-Z0-9]+$/, 'El serial debe ser alfanumérico'),
  
  tipo: CatalogoSchema,
  marca: CatalogoSchema,
  modelo: CatalogoSchema.optional(),
  
  ubicacion: UbicacionSchema,
  
  proyecto: ProyectoSchema.optional().nullable(),
  usuarioAsignado: UsuarioAdSchema.optional().nullable(),
  
  estado: z.enum(['Activo', 'Funcional inactivo', 'Dañado', 'Robado', 'Baja']),
  
  fechaCompra: z.string().datetime().optional(), // ISO string
  garantiaExpiracion: z.string().datetime().optional(),
  
  accesorios: z.record(z.any()).optional()
});

// Type inference example
export type ActivoDto = z.infer<typeof ActivoSchema>;
