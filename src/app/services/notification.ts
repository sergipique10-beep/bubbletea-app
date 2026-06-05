import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Notification {
  id: number;
  user_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/notifications`;

  notifications = signal<Notification[]>([]);
  unreadCount = signal<number>(0);

  async loadNotifications(): Promise<void> {
    const data = await firstValueFrom(this.http.get<Notification[]>(this.apiUrl));
    this.notifications.set(data);
    this.unreadCount.set(data.filter(n => !n.is_read).length);
  }

  async markAsRead(id: number): Promise<void> {
    await firstValueFrom(this.http.put(`${this.apiUrl}/${id}/read`, {}));
    await this.loadNotifications();
  }

  async markAllAsRead(): Promise<void> {
    await firstValueFrom(this.http.put(`${this.apiUrl}/read-all`, {}));
    await this.loadNotifications();
  }
}
