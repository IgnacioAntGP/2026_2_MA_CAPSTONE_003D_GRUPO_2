import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonToast,
} from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonToast,
  ],
})
export class LoginPage {
  correo: string = '';
  password: string = '';

  // Control para el mensaje de retroalimentación
  isToastOpen: boolean = false;
  toastMessage: string = '';

  constructor(private router: Router) {}

  ingresar() {
    // Validación de campos vacíos
    if (!this.correo.trim() || !this.password.trim()) {
      this.mostrarAlerta('Por favor completa todos los campos');
      return;
    }

    // Validación básica de formato de correo institucional
    if (!this.correo.includes('@')) {
      this.mostrarAlerta('Ingresa un correo institucional válido');
      return;
    }

    // Navegación hacia el panel de inicio
    this.router.navigate(['/home']);
  }

  private mostrarAlerta(mensaje: string) {
    this.toastMessage = mensaje;
    this.isToastOpen = true;
  }
}