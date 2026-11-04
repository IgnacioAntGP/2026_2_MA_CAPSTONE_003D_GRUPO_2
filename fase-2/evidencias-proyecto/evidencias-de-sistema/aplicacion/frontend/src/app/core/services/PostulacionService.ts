import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PostulacionAyudante } from '../../models/IPostulacionAyudante';

@Injectable({
    providedIn: 'root'
})
export class PostulacionService {

    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    postularComoAyudante(idUsuario: number, idAsignatura: number | null, motivo: string, experiencia: string): Observable<any> {
        return this.http.post<any>(
            `${this.apiUrl}/postulaciones-ayudante`,
            { id_usuario: idUsuario, id_asignatura: idAsignatura, motivo, experiencia }
        );
    }

    obtenerPostulacionesPendientes(): Observable<PostulacionAyudante[]> {
        return this.http.get<PostulacionAyudante[]>(
            `${this.apiUrl}/postulaciones-ayudante/pendientes`
        );
    }

    aprobarPostulacionAyudante(idSolicitud: number, idAsignatura?: number | null): Observable<any> {
        return this.http.patch<any>(
            `${this.apiUrl}/postulaciones-ayudante/${idSolicitud}/aprobar`,
            {id_asignatura: idAsignatura || null}
        );
    }

    rechazarPostulacionAyudante(idSolicitud: number): Observable<any> {
        return this.http.patch<any>(
            `${this.apiUrl}/postulaciones-ayudante/${idSolicitud}/rechazar`,
            {}
        );
    }
}