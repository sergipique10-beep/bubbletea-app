import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserCreate {
  name: string;
  surname: string;
  email: string;
  birth_date: string;
  active: boolean;
  notifications: boolean;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  createUser(user: UserCreate): Promise<any> {
    return firstValueFrom(this.http.post(this.apiUrl, user));
  }
}
