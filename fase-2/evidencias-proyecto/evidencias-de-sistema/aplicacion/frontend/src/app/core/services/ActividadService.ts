import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IActividad } from '../../models/IActividad';

@Injectable({
  providedIn: 'root'
})
export class ActividadService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  listarActividades(idAyudantia: number): Observable<IActividad[]> {
    return this.http.get<IActividad[]>(`${this.apiUrl}/ayudantias/${idAyudantia}/actividades`);
  }

  crearActividad(idAyudantia: number, data: { idCategoria: number; nombreActividad: string; descripcion: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/ayudantias/${idAyudantia}/actividades`, data);
  }

  modificarEstadoActividad(idAyudantia: number, idActividad: number, idEstadoActividad: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/ayudantias/${idAyudantia}/actividades/${idActividad}`, {
      idEstadoActividad
    });
  }
}