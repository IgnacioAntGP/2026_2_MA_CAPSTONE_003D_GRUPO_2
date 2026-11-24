import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import {
  IonContent,
  IonInput,
  IonButton
} from '@ionic/angular';

import { LoginService } from '../../../core/services/LoginService';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    IonContent,
    IonInput,
    IonButton
  ]
})
export class LoginPage implements OnInit {

  correo: string = '';
  password: string = '';

  cargando: boolean = false;
  errorLogin: string = '';

  constructor(
    private loginService: LoginService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit() {

  }


  ingresar() {

    if (this.cargando) {
      return;
    }

    this.errorLogin = '';

    if (
      !this.correo.trim() ||
      !this.password
    ) {

      this.errorLogin =
        'Debes ingresar correo y contraseña.';

      return;
    }

    this.cargando = true;

    this.loginService
      .login(
        this.correo,
        this.password
      )
      .subscribe({

        next: () => {

          this.cargando = false;

          this.correo = '';
          this.password = '';
          this.errorLogin = '';

          this.cdr.detectChanges();

          this.router.navigate([
            '/comunidad'
          ]);
        },

        error: (
          error: HttpErrorResponse
        ) => {

          this.cargando = false;

          this.errorLogin =
            error.error?.error ||
            'No fue posible iniciar sesión. Intenta nuevamente.';

          this.password = '';

          this.cdr.detectChanges();
        }

      });

  }

}