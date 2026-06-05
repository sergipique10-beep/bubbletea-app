import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  name = '';
  surname = '';
  email = '';
  birthDate = '';
  notifications = true;
  password = '';
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';
  loading = false;

  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  async onSubmit() {
    if (!this.name || !this.surname || !this.email || !this.birthDate || !this.password || !this.confirmPassword) return;
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }
    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    try {
      await this.authService.register(this.email, this.password, this.name);
      await this.userService.createUser({
        name: this.name,
        surname: this.surname,
        email: this.email,
        birth_date: this.birthDate,
        active: true,
        notifications: this.notifications,
      });
      this.successMessage = '¡Cuenta creada! Redirigiendo...';
      setTimeout(() => this.router.navigate(['/home']), 1500);
    } catch (error: any) {
      this.errorMessage = this.getErrorMessage(error.code);
    } finally {
      this.loading = false;
    }
  }

  private getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use': return 'Ya existe una cuenta con ese correo.';
      case 'auth/invalid-email': return 'Correo electrónico inválido.';
      case 'auth/weak-password': return 'La contraseña es muy débil.';
      default: return 'Error al crear la cuenta. Inténtalo de nuevo.';
    }
  }
}
