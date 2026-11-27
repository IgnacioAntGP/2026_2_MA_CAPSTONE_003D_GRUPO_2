import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type {
  CrearUsuarioRequest,
  ModificarUsuarioRequest,
  UsuarioResponse
} from '../../models/IUsuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly apiUrl = `${environment.apiUrl}/usuarios`;
  private readonly http = inject(HttpClient);

  listarUsuarios(): Observable<UsuarioResponse[]> {
    return this.http.get<UsuarioResponse[]>(this.apiUrl);
  }

  obtenerUsuario(idUsuario: number): Observable<UsuarioResponse> {
    return this.http.get<UsuarioResponse>(`${this.apiUrl}/${idUsuario}`);
  }

  crearUsuario(payload: CrearUsuarioRequest): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(this.apiUrl, payload);
  }

  modificarUsuario(
    idUsuario: number,
    payload: ModificarUsuarioRequest
  ): Observable<UsuarioResponse> {
    return this.http.patch<UsuarioResponse>(
      `${this.apiUrl}/${idUsuario}`,
      payload
    );
  }

  activarUsuario(idUsuario: number): Observable<UsuarioResponse> {
    return this.http.patch<UsuarioResponse>(
      `${this.apiUrl}/${idUsuario}/activar`,
      {}
    );
  }

  desactivarUsuario(idUsuario: number): Observable<UsuarioResponse> {
    return this.http.patch<UsuarioResponse>(
      `${this.apiUrl}/${idUsuario}/desactivar`,
      {}
    );
  }
}
