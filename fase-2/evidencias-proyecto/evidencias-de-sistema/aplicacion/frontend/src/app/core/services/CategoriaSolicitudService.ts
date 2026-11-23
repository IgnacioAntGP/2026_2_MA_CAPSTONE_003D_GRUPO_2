import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CategoriaSolicitudService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    listarCategoriasSolicitud(): Observable<{ id_categoria: number; nombre: string }[]> {
        return this.http.get<any[]>(`${this.apiUrl}/categorias-solicitud`);
    }
}
