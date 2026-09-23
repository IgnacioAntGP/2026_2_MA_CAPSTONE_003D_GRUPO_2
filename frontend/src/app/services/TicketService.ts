import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TicketConsulta, TicketNuevo } from '../models/ITicketConsulta';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  // Ajusta a la URL base de tu backend/API REST
  private apiUrl = 'http://localhost:3000/api/tickets'; 

  constructor(private http: HttpClient) {}

  // POST: Crear nuevo ticket de consulta
  crearTicket(ticket: TicketNuevo): Observable<TicketConsulta> {
    return this.http.post<TicketConsulta>(this.apiUrl, ticket);
  }

  // GET: Obtener tickets pendientes (para la vista del ayudante)
  obtenerTicketsPendientes(): Observable<TicketConsulta[]> {
    return this.http.get<TicketConsulta[]>(`${this.apiUrl}/pendientes`);
  }
}