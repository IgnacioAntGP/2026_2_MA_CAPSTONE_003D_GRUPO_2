import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ICategoriaActividad } from '../../models/ICategoriaActividad'

@Injectable({
    providedIn: 'root',
})
export class CategoriaActividadService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    obtenerCategoriasActividad(): Observable<ICategoriaActividad[]> {
    return this.http.get<ICategoriaActividad[]>(`${this.apiUrl}/categorias-actividades`).pipe(
            tap(data => console.log("payload obtenerCategoriasActividad (datos reales):", data))
        );
    }
}
