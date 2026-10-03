import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/public/login/login.page').then( m => m.LoginPage)
  },
    {
    path: 'comunidad',
    loadComponent: () =>
      import('./pages/public/comunidad/comunidad.page').then((m) => m.ComunidadPage),
  },
  {
  path: 'nueva-publicacion',
  loadComponent: () =>
    import('./pages/estudiante/nueva-publicacion/nueva-publicacion.page')
      .then((m) => m.NuevaPublicacionPage),
  },
  {
    path: 'detalle-consulta/:id',
    loadComponent: () =>
      import('./pages/public/detalle-consulta/detalle-consulta.page')
        .then((m) => m.DetalleConsultaPage),
  },
  {
    path: 'solicitar-tutoria/:id',
    loadComponent: () =>
      import('./pages/estudiante/solicitar-tutoria/solicitar-tutoria.page')
        .then((m) => m.SolicitarTutoriaPage),
  },
  {
  path: 'mis-tutorias',
  loadComponent: () =>
    import('./pages/ayudante/mis-tutorias/mis-tutorias.page')
      .then((m) => m.MisTutoriasPage),
  },
  {
  path: 'mis-publicaciones',
  loadComponent: () =>
    import('./pages/estudiante/mis-publicaciones/mis-publicaciones.page')
      .then((m) => m.MisPublicacionesPage),
  },   
  {
  path: 'evaluaciones',
  loadComponent: () =>
    import('./pages/ayudante/evaluaciones/evaluaciones.page')
      .then((m) => m.EvaluacionesPage),
  },   
  {
  path: 'evaluar-tutoria',
  loadComponent: () =>
    import('./pages/estudiante/evaluar-tutoria/evaluar-tutoria.page')
      .then((m) => m.EvaluarTutoriaPage),
  },  
  {
  path: 'mi-perfil',
  loadComponent: () =>
    import('./pages/cuenta/mi-perfil/mi-perfil.page')
      .then((m) => m.MiPerfilPage),
  },  
  {
  path: 'solicitar-ayudante',
  loadComponent: () =>
    import('./pages/estudiante/solicitar-ayudante/solicitar-ayudante.page')
      .then((m) => m.SolicitarAyudantePage),
  },
  {
    path: 'editar-publicacion/:id',
    loadComponent: () =>
      import('./pages/estudiante/editar-publicacion/editar-publicacion.page')
        .then(m => m.EditarPublicacionPage)
  }, 
  {
  path: 'editar-perfil',
  loadComponent: () =>
    import('./pages/cuenta/editar-perfil/editar-perfil.page')
      .then((m) => m.EditarPerfilPage),
  },  
  

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
  }
];
