# AsistIA Frontend

App web para gestión de clínicas estéticas. Construido con React 18, TypeScript, Tailwind CSS y Vite.

## Features

- 📱 Dashboard de administración
- 📅 Gestión de calendario y citas
- 💬 Centro de mensajes unificado (WhatsApp, SMS, Email)
- 👥 Gestión de clientes
- 📊 Reportes y estadísticas
- 🌙 Dark mode

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **React Router** - Navigation
- **TanStack Query** - Data fetching
- **Zustand** - State management

## Getting Started

### Requisitos
- Node.js 18+
- npm o yarn

### Instalación

```bash
# Clonar repo
git clone https://github.com/tu-usuario/asistia-app.git
cd asistia-app

# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build
npm run build

# Preview
npm run preview
```

## Estructura de Carpetas

```
src/
├── components/        # Componentes reutilizables
│   ├── layout/       # Layout components
│   ├── appointment/  # Appointment components
│   ├── calendar/     # Calendar components
│   ├── messages/     # Message components
│   ├── dashboard/    # Dashboard components
│   └── common/       # Common UI components
├── pages/            # Página principales
├── hooks/            # Custom hooks
├── api/              # API client
└── styles/           # Global styles
```

## Rutas Principales

- `/` - Home
- `/login` - Login
- `/dashboard` - Dashboard
- `/clientes` - Gestión de clientes
- `/calendario` - Calendario de citas
- `/crear-cita` - Crear nueva cita
- `/mensajes` - Centro de mensajes

## Deployment

Desplegada automáticamente en Vercel con cada push a main.

**URL:** [tu-url-vercel.vercel.app](https://tu-url-vercel.vercel.app)

## License

Propiedad de AsistIA
