import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IAsignatura } from '../../models/IAsignatura';

@Injectable({
  providedIn: 'root'
})
export class AsignaturaService {
  private apiUrl = `${environment.apiUrl}/asignaturas`;

  constructor(private http: HttpClient) {}

  // Obtiene todas las asignaturas para el catálogo / select
  obtenerAsignaturas(): Observable<IAsignatura[]> {
    return this.http.get<IAsignatura[]>(this.apiUrl);
  }

  // Crea una nueva asignatura enviando el payload al backend
  crearAsignatura(payload: { nombre: string; codigo: string; descripcion?: string | null }): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload);
  }
}