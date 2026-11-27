import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/public/login/login.page')
        .then((m) => m.LoginPage)
  },
  {
    path: 'comunidad',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/foro/comunidad/comunidad.page')
        .then((m) => m.ComunidadPage)
  },
  {
    path: 'nueva-publicacion',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/estudiante/nueva-publicacion/nueva-publicacion.page')
        .then((m) => m.NuevaPublicacionPage)
  },
  {
    path: 'detalle-consulta/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/foro/detalle-consulta/detalle-consulta.page')
        .then((m) => m.DetalleConsultaPage)
  },
  {
    path: 'solicitar-ayudante/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/estudiante/solicitar-ayudante/solicitar-ayudante.page')
        .then((m) => m.SolicitarAyudantePage)
  },
  {
    path: 'mis-ayudantias',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/estudiante/mis-ayudantias/mis-ayudantias.page')
        .then((m) => m.MisAyudantiasPage)
  },
  {
    path: 'mis-publicaciones',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/estudiante/mis-publicaciones/mis-publicaciones.page')
        .then((m) => m.MisPublicacionesPage)
  },
  {
    path: 'evaluaciones',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/estudiante/evaluaciones/evaluaciones.page')
        .then((m) => m.EvaluacionesPage)
  },
  {
    path: 'evaluar-tutoria',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/estudiante/evaluar-tutoria/evaluar-tutoria.page')
        .then((m) => m.EvaluarTutoriaPage)
  },
  {
    path: 'mi-perfil',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/cuenta/mi-perfil/mi-perfil.page')
        .then((m) => m.MiPerfilPage)
  },
  {
    path: 'postular-ayudante',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/estudiante/postular-ayudante/postular-ayudante.page')
        .then((m) => m.PostularAyudantePage)
  },
  {
    path: 'editar-publicacion/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/estudiante/editar-publicacion/editar-publicacion.page')
        .then((m) => m.EditarPublicacionPage)
  },
  {
    path: 'editar-perfil',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/cuenta/editar-perfil/editar-perfil.page')
        .then((m) => m.EditarPerfilPage)
  },

  /* =========================
     AYUDANTE
     ========================= */

  {
    path: 'ayudante',
    redirectTo: 'ayudante/tabs/panel',
    pathMatch: 'full'
  },
  {
    path: 'ayudante/tabs',
        canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMINISTRADOR', 'AYUDANTE'] },
    loadComponent: () =>
      import('./pages/ayudante/tabs/tabs.page')
        .then((m) => m.TabsPage),
    children: [
      {
        path: 'panel',
        loadComponent: () =>
          import('./pages/ayudante/panel-ayudante/panel-ayudante.page')
            .then((m) => m.PanelAyudantePage)
      },
      {
        path: 'solicitudes',
        loadComponent: () =>
          import('./pages/ayudante/solicitudes-pendientes/solicitudes-pendientes.page')
            .then((m) => m.SolicitudesPendientesPage)
      },
      {
        path: 'mis-ayudantias',
        loadComponent: () =>
          import('./pages/ayudante/mis-ayudantias/mis-ayudantias.page')
            .then((m) => m.MisAyudantiasPage)
      },
      {
        path: '',
        redirectTo: 'panel',
        pathMatch: 'full'
      }
    ]
  },

  /* =========================
     ADMINISTRADOR
     ========================= */

  {
    path: 'panel-admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMINISTRADOR'] },
    loadComponent: () =>
      import('./pages/admin/panel-admin/panel-admin.page')
        .then((m) => m.PanelAdminPage)
  },
  {
    path: 'postulaciones-ayudante',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMINISTRADOR'] },
    loadComponent: () =>
      import('./pages/admin/postulaciones-ayudante/postulaciones-ayudante.page')
        .then((m) => m.PostulacionesAyudantePage)
  },
  {
    path: 'gestion-ayudantes',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMINISTRADOR'] },
    loadComponent: () =>
      import('./pages/admin/gestion-ayudantes/gestion-ayudantes.page')
        .then((m) => m.GestionAyudantesPage)
  },
  {
    path: 'categoria-solicitudes',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMINISTRADOR'] },
    loadComponent: () =>
      import('./pages/admin/categoria-solicitudes/categoria-solicitudes.page')
        .then((m) => m.CategoriaSolicitudesPage)
  },
  {
    path: 'estadisticas-admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMINISTRADOR'] },
    loadComponent: () =>
      import('./pages/admin/estadisticas-admin/estadisticas-admin.page')
        .then(m => m.EstadisticasAdminPage)
  },

  /* =========================
     AYUDANTÍA
     ========================= */

  {
    path: 'gestion-ayudantia/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/ayudantia/gestion-ayudantia/gestion-ayudantia.page')
        .then((m) => m.GestionAyudantiaPage)
  },

  /* =========================
     REDIRECCIONES
     ========================= */

  {
    path: '**',
    redirectTo: 'login'
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }

];