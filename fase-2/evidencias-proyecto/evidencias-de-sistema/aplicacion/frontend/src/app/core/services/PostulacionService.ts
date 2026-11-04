import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Consulta, NuevaConsulta } from '../../models/IConsulta';
import { SolicitudAyudantia, SolicitudAyudantiaPayloadNuevo } from '../../models/ISolicitudAyudantia';
import { PostulacionAyudante } from '../../models/IPostulacionAyudante';
import { RespuestaConsulta } from '../../models/IRespuesta';
import { MisTutoria } from '../../models/IMisTutorias';
import { PerfilUsuario } from '../../models/IPerfil';
import { CategoriaSolicitud } from '../../models/IFiltros';

@Injectable({
    providedIn: 'root'
})
export class PostulacionService {

    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    postularComoAyudante(idUsuario: number, motivo: string, experiencia: string): Observable<any> {
        return this.http.post<any>(
            `${this.apiUrl}/postulaciones-ayudante`,
            { id_usuario: idUsuario, motivo, experiencia }
        );
    }

    obtenerPostulacionesPendientes(): Observable<PostulacionAyudante[]> {
        return this.http.get<PostulacionAyudante[]>(
            `${this.apiUrl}/postulaciones-ayudante/pendientes`
        );
    }

    aprobarPostulacionAyudante(idSolicitud: number): Observable<any> {
        return this.http.patch<any>(
            `${this.apiUrl}/postulaciones-ayudante/${idSolicitud}/aprobar`,
            {}
        );
    }

    rechazarPostulacionAyudante(idSolicitud: number): Observable<any> {
        return this.http.patch<any>(
            `${this.apiUrl}/postulaciones-ayudante/${idSolicitud}/rechazar`,
            {}
        );
    }
}