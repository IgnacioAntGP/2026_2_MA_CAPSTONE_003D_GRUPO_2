import { inject } from '@angular/core';

import {
  HttpInterceptorFn
} from '@angular/common/http';

import { LoginService } from '../services/LoginService';

export const authInterceptor: HttpInterceptorFn = (
  req,
  next
) => {

  const loginService =
    inject(LoginService);

  const esLogin =
    req.url.includes('/auth/login');

  if (
    esLogin ||
    !loginService.estaAutenticado()
  ) {

    return next(req);
  }

  const token =
    loginService.obtenerToken();

  if (!token) {

    return next(req);
  }

  const requestConToken =
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

  return next(requestConToken);
};