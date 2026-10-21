import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CategoriaSolicitud, NuevaCategoriaSolicitud } from '../../models/IFiltros';

@Injectable({
  providedIn: 'root'
})
export class AdministracionService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerCategorias(): Observable<CategoriaSolicitud[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categorias-solicitud`).pipe(
        map(items => items.map(cat => ({
        id_categoria: BigInt(cat.id_categoria),
        nombre: cat.nombre,
        descripcion: cat.descripcion,
        esActivo: cat.es_activo ?? cat.esActivo ?? true
        })))
    );
  }

  crearCategoria(payload: NuevaCategoriaSolicitud): Observable<CategoriaSolicitud> {
        const body = {
            nombre: payload.nombre,
            descripcion: payload.descripcion,
            es_activo: payload.esActivo ?? true
        };

        return this.http.post<any>(`${this.apiUrl}/categorias-solicitud`, body).pipe(
            map(res => {
                const data = Array.isArray(res) ? res[0] : (res?.categoria || res?.data || res);

                const rawId = data?.id_categoria ?? data?.id;

                const idFinal = (rawId !== undefined && rawId !== null)
                    ? BigInt(rawId)
                    : BigInt(Date.now());

                return {
                    id_categoria: idFinal,
                    nombre: data?.nombre || payload.nombre,
                    descripcion: data?.descripcion || payload.descripcion,
                    esActivo: data?.es_activo ?? data?.esActivo ?? true
                };
            })
        );
    }
}