import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface BubbleTea {
  id: number;
  name: string;
  temperature: string;
  price: number;
  active: boolean;
}

export interface BubbleTeaCreate {
  name: string;
  temperature: string;
  price: number;
  active: boolean;
}

@Injectable({ providedIn: 'root' })
export class BubbleTeaService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getBubbleTeas(): Observable<BubbleTea[]> {
    return this.http.get<BubbleTea[]>(`${this.apiUrl}/bubbleteasfromaiven`);
  }

  createBubbleTea(data: BubbleTeaCreate): Observable<BubbleTea> {
    return this.http.post<BubbleTea>(`${this.apiUrl}/bubbleteasfromaiven`, data);
  }
}
