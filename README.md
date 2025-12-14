# AkpoClient - Corporate Management Platform

Plataforma frontend moderna desarrollada en **Angular 18+** para la gestión corporativa integral, incluyendo onboarding de usuarios y gestión de actas de equipos. Backend API REST expuesto por **n8n self-hosted**.

---

## 🚀 Tecnologías

- **Angular 18+**: Standalone Components, Signals, Functional Router/Guards
- **Tailwind CSS**: Diseño moderno y responsivo
- **Reactive Forms**: Formularios fuertemente tipados con validaciones
- **ngx-toastr**: Sistema de notificaciones
- **RxJS**: Manejo reactivo de asincronía
- **TypeScript Strict Mode**: Código 100% tipado

---

## 📋 Requisitos Previos

- **Node.js** v18 o superior
- **npm** v10 o superior
- **Angular CLI** v18: `npm install -g @angular/cli`

---

## 🛠️ Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone <repository-url>
   cd Akpoclient
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Iniciar servidor de desarrollo**:
   ```bash
   npm start
   ```
   La aplicación estará disponible en `http://localhost:4200`

---

## 📂 Estructura del Proyecto

```
src/app/
├── core/                    # Servicios globales, guards, interceptors
│   ├── guards/              # AuthGuard
│   ├── interceptors/        # Auth & Error interceptors
│   ├── services/            # AuthService, ApiService, ErrorHandler
│   └── models/              # Interfaces globales
├── features/                # Módulos funcionales (lazy-loaded)
│   ├── auth/                # Login y autenticación
│   ├── dashboard/           # Dashboard principal
│   ├── onboarding/          # Gestión de onboarding
│   └── actas/               # Gestión de actas de equipos
├── shared/                  # Componentes reutilizables
│   ├── components/          # Header, Sidebar, Spinner
│   ├── pipes/
│   └── directives/
└── environments/            # Configuración de entornos
```

---

## 🎯 Módulos Funcionales

### 1. **Autenticación** (`/auth`)
- Login con validación de credenciales
- Integración con JWT
- Redirección automática según estado de sesión

### 2. **Dashboard** (`/dashboard`)
- Vista general con estadísticas
- Acceso rápido a módulos principales
- Información del usuario logueado

### 3. **Onboarding** (`/onboarding`)
- Formulario de carga de archivos (CSV/XLSX)
- Configuración de modo y credenciales
- Tabla de resultados en tiempo real
- Barra de progreso

### 4. **Inventario** (`/inventario`)
- Consulta general de equipos
- Filtros por Proyecto, Estado y Búsqueda (Serial/Usuario)
- Visualización de accesorios asignados
- Exportación a Excel de resultados filtrados

### 5. **Actas** (`/actas`)
#### Crear Acta (`/actas/crear`)
- Formulario de asignación/devolución de equipos
- Tabla dinámica de equipos con validación
- Validación de usuarios contra Active Directory
- Selección de periféricos
- Campo opcional de ticket

#### Aprobar PDF (`/actas/aprobar`)
- Subida de PDF con drag & drop
- Aprobación automática o manual
- Feedback inmediato

#### Dashboard (`/actas`)
- Tab de solicitudes pendientes
- Tab de histórico completo
- Exportación a Excel
- Aprobación manual desde tabla

---

## 🔌 Configuración de API (n8n)

### Variables de Entorno

Edita `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  baseUrl: 'http://localhost:5678/webhook',
  useMocks: true  // Cambiar a false para usar API real
};
```

### Endpoints Requeridos

#### Autenticación
- `POST /webhook/login` - Login de usuario

#### Onboarding
- `POST /webhook/onboarding` - Procesar archivo de onboarding
- `GET /webhook/history` - Histórico de procesos

#### Actas
- `POST /webhook/form-solicitud` - Crear solicitud de acta
- `POST /webhook/aprobar-acta` - Aprobar acta con PDF
- `GET /webhook/listar-pendientes` - Listar actas pendientes
- `POST /webhook/aprobar-manual` - Aprobar manualmente
- `GET /webhook/listar-historico` - Histórico de actas
- `POST /webhook/validar-serial` - Validar serial de equipo
- `POST /webhook/validar-usuario` - Validar usuario en AD

#### Inventario
- `GET /webhook/inventario` - Consulta con filtros (proyecto, estado, búsqueda)
- `GET /webhook/inventario/proyectos` - Lista de proyectos disponibles

---

## 🧪 Modo Mock

El proyecto incluye un **sistema de mocks** para desarrollo sin backend:

- **Activar**: `useMocks: true` en `environment.ts`
- **Desactivar**: `useMocks: false` (requiere n8n configurado)

En modo mock, todos los servicios devuelven datos simulados con delays realistas.

---

## 🎨 Estilos y Diseño

- **Framework CSS**: Tailwind CSS 3.4+
- **Paleta de colores**: Definida en `tailwind.config.js`
- **Componentes**: Standalone con templates inline o separados
- **Responsivo**: Mobile-first design

---

## 🔐 Seguridad

- **JWT Authentication**: Token almacenado en localStorage
- **Auth Interceptor**: Añade token automáticamente a requests
- **Error Interceptor**: Manejo global de errores HTTP
- **Auth Guard**: Protección de rutas privadas
- **Logout automático**: En caso de 401 Unauthorized

---

## 📦 Build de Producción

```bash
ng build --configuration production
```

Los archivos compilados estarán en `dist/akpoclient/`

---

## 🧑‍💻 Desarrollo

### Generar Componentes
```bash
ng generate component features/nombre-modulo/nombre-componente --standalone
```

### Generar Servicios
```bash
ng generate service features/nombre-modulo/services/nombre-servicio
```

### Linting
```bash
ng lint
```

---

## 📚 Documentación Adicional

- [Guía de configuración n8n](./n8n-setup-guide.md) (pendiente)
- [Documentación de Actas](./src/app/features/actas/README.md)

---

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es privado y de uso interno corporativo.

---

## 👨‍💻 Arquitectura

- **Patrón**: Feature-based modules con lazy loading
- **Estado**: Signals + RxJS
- **Routing**: Functional guards y resolvers
- **HTTP**: Interceptors para auth y error handling
- **Formularios**: Reactive Forms con validaciones custom
```
