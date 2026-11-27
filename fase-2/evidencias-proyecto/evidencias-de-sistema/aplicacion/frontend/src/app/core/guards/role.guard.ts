import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/LoginService';
import { RolAuth } from '../../models/IAuth';

function extraerNombreRoles(roles: unknown): string[] {
  if (!Array.isArray(roles)) {
    return [];
  }

  return roles
    .map((rol: RolAuth | string) => {
      if (typeof rol === 'string') {
        return rol;
      }
      return rol?.nombre ?? '';
    })
    .map((nombre) => nombre.trim().toUpperCase())
    .filter(Boolean);
}

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  if (!loginService.estaAutenticado()) {
    return router.createUrlTree(['/login']);
  }

  const rolesPermitidos = extraerNombreRoles(route.data?.['roles']);

  if (rolesPermitidos.length === 0) {
    return true;
  }

  const rolesUsuario = extraerNombreRoles(loginService.obtenerRoles());
  const tienePermiso = rolesPermitidos.some((permitido) =>
    rolesUsuario.includes(permitido)
  );

  if (tienePermiso) {
    return true;
  }

  // Redirige a la vista principal tras login si no tiene el rol requerido
  return router.createUrlTree(['/comunidad']);
};