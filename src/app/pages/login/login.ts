import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  loading = false;

  private authService = inject(AuthService);
  private router = inject(Router);

  async onSubmit() {
    if (!this.email || !this.password) return;
    this.loading = true;
    this.errorMessage = '';
    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.errorMessage = this.getErrorMessage(error.code);
    } finally {
      this.loading = false;
    }
  }

  private getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/invalid-credential': return 'Correo o contraseña incorrectos.';
      case 'auth/user-not-found': return 'No existe una cuenta con ese correo.';
      case 'auth/wrong-password': return 'Contraseña incorrecta.';
      case 'auth/invalid-email': return 'Correo electrónico inválido.';
      case 'auth/too-many-requests': return 'Demasiados intentos. Intenta más tarde.';
      default: return 'Error al iniciar sesión. Inténtalo de nuevo.';
    }
  }
}
