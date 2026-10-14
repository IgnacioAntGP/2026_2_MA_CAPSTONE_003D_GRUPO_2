import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/public/login/login.page')
        .then((m) => m.LoginPage)
  },
  {
    path: 'comunidad',
    loadComponent: () =>
      import('./pages/foro/comunidad/comunidad.page')
        .then((m) => m.ComunidadPage)
  },
  {
    path: 'nueva-publicacion',
    loadComponent: () =>
      import('./pages/estudiante/nueva-publicacion/nueva-publicacion.page')
        .then((m) => m.NuevaPublicacionPage)
  },
  {
    path: 'detalle-consulta/:id',
    loadComponent: () =>
      import('./pages/foro/detalle-consulta/detalle-consulta.page')
        .then((m) => m.DetalleConsultaPage)
  },
  {
    path: 'solicitar-ayudante/:id',
    loadComponent: () =>
      import('./pages/estudiante/solicitar-ayudante/solicitar-ayudante.page')
        .then((m) => m.SolicitarAyudantePage)
  },
  {
    path: 'mis-tutorias',
    loadComponent: () =>
      import('./pages/estudiante/mis-tutorias/mis-tutorias.page')
        .then((m) => m.MisTutoriasPage)
  },
  {
    path: 'mis-publicaciones',
    loadComponent: () =>
      import('./pages/estudiante/mis-publicaciones/mis-publicaciones.page')
        .then((m) => m.MisPublicacionesPage)
  },  
  {
    path: 'evaluaciones',
    loadComponent: () =>
      import('./pages/estudiante/evaluaciones/evaluaciones.page')
        .then((m) => m.EvaluacionesPage)
  },  
  {
    path: 'evaluar-tutoria',
    loadComponent: () =>
      import('./pages/estudiante/evaluar-tutoria/evaluar-tutoria.page')
        .then((m) => m.EvaluarTutoriaPage)
  },
  {
    path: 'mi-perfil',
    loadComponent: () =>
      import('./pages/cuenta/mi-perfil/mi-perfil.page')
        .then((m) => m.MiPerfilPage)
  },
  {
    path: 'postular-ayudante',
    loadComponent: () =>
      import('./pages/estudiante/postular-ayudante/postular-ayudante.page')
        .then((m) => m.PostularAyudantePage)
  },
  {
    path: 'editar-publicacion/:id',
    loadComponent: () =>
      import('./pages/estudiante/editar-publicacion/editar-publicacion.page')
        .then((m) => m.EditarPublicacionPage)
  },
  {
    path: 'editar-perfil',
    loadComponent: () =>
      import('./pages/cuenta/editar-perfil/editar-perfil.page')
        .then((m) => m.EditarPerfilPage)
  },
  {
    path: 'ayudante',
    redirectTo: 'ayudante/tabs/panel',
    pathMatch: 'full'   
  },
  {
    path: 'ayudante/tabs',
    loadComponent: () => import('./pages/ayudante/tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'panel',
        loadComponent: () => import('./pages/ayudante/panel-ayudante/panel-ayudante.page').then(m => m.PanelAyudantePage)
      },
      {
        path: 'solicitudes',
        loadComponent: () => import('./pages/ayudante/solicitudes-pendientes/solicitudes-pendientes.page').then(m => m.SolicitudesPendientesPage)
      },
      {
        path: 'mis-ayudantias',
        loadComponent: () => import('./pages/ayudante/mis-ayudantias/mis-ayudantias.page').then(m => m.MisAyudantiasPage)
      },
      {
        path: '',
        redirectTo: 'panel',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'panel-admin',
    loadComponent: () => import('./pages/admin/panel-admin/panel-admin.page').then( m => m.PanelAdminPage)
  },
  {
    path: 'postulaciones-ayudante',
    loadComponent: () => import('./pages/admin/postulaciones-ayudante/postulaciones-ayudante.page').then( m => m.PostulacionesAyudantePage)
  },
  {
    path: '**',
    redirectTo: 'login',
  }
];
