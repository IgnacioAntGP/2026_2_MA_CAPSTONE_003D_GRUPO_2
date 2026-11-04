import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  ICrearEspecialidadAsk, 
  ICrearEspecialidadResolve, 
  IObtenerEspecialidadesResolve 
} from '../../models/IEspecialidadAyudante';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {
  private apiUrl = `${environment.apiUrl}/especialidades`;

  constructor(private http: HttpClient) {}

  // Crear una nueva especialización (conecta con CrearEspecialidadAskDTO y ResolveDTO)
  crearEspecialidad(data: ICrearEspecialidadAsk): Observable<ICrearEspecialidadResolve> {
    return this.http.post<ICrearEspecialidadResolve>(this.apiUrl, data);
  }

  // Obtener especialidades por ID de ayudante
  obtenerEspecialidadesUsuario(idUsuario: number): Observable<IObtenerEspecialidadesResolve[]> {
    return this.http.get<IObtenerEspecialidadesResolve[]>(`${this.apiUrl}/usuario/${idUsuario}`);
  }
}