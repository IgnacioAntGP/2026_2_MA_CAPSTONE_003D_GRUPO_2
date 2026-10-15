import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone:true,
  imports: [IonContent, CommonModule, FormsModule, RouterLink]
})
export class LoginPage implements OnInit {

  correo: string = '';
  password: string = '';

  constructor() { }

  ngOnInit() {

  }

  ingresar() {
    console.log('Correo:', this.correo);
    console.log('Contraseña:', this.password);
  }

}