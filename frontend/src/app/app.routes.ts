import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
    {
    path: 'comunidad',
    loadComponent: () =>
      import('./pages/comunidad/comunidad.page').then((m) => m.ComunidadPage),
  },
  {
  path: 'nueva-publicacion',
  loadComponent: () =>
    import('./pages/nueva-publicacion/nueva-publicacion.page')
      .then((m) => m.NuevaPublicacionPage),
  },
  {
    path: 'detalle-consulta/:id',
    loadComponent: () =>
      import('./pages/detalle-consulta/detalle-consulta.page')
        .then((m) => m.DetalleConsultaPage),
  },
  {
    path: 'solicitar-tutoria/:id',
    loadComponent: () =>
      import('./pages/solicitar-tutoria/solicitar-tutoria.page')
        .then((m) => m.SolicitarTutoriaPage),
  },
  {
  path: 'mis-tutorias',
  loadComponent: () =>
    import('./pages/mis-tutorias/mis-tutorias.page')
      .then((m) => m.MisTutoriasPage),
  },
  {
  path: 'mis-publicaciones',
  loadComponent: () =>
    import('./pages/mis-publicaciones/mis-publicaciones.page')
      .then((m) => m.MisPublicacionesPage),
  },   
  {
  path: 'evaluaciones',
  loadComponent: () =>
    import('./pages/evaluaciones/evaluaciones.page')
      .then((m) => m.EvaluacionesPage),
  },   
  {
  path: 'evaluar-tutoria',
  loadComponent: () =>
    import('./pages/evaluar-tutoria/evaluar-tutoria.page')
      .then((m) => m.EvaluarTutoriaPage),
  },  
  {
  path: 'mi-perfil',
  loadComponent: () =>
    import('./pages/mi-perfil/mi-perfil.page')
      .then((m) => m.MiPerfilPage),
  },  
  {
  path: 'solicitar-ayudante',
  loadComponent: () =>
    import('./pages/solicitar-ayudante/solicitar-ayudante.page')
      .then((m) => m.SolicitarAyudantePage),
  },
  {
    path: 'editar-publicacion/:id',
    loadComponent: () =>
      import('./pages/editar-publicacion/editar-publicacion.page')
        .then(m => m.EditarPublicacionPage)
  }, 
  {
  path: 'editar-perfil',
  loadComponent: () =>
    import('./pages/editar-perfil/editar-perfil.page')
      .then((m) => m.EditarPerfilPage),
  },  
  {
    path: 'panel-ayudante',
    loadComponent: () => import('./pages/panel-ayudante/panel-ayudante.page').then( m => m.PanelAyudantePage)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
  },

];
