import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Pedido {
  id: number;
  bubble_tea_id: number;
  cantidad: number;
  estado: string;
  fecha_creacion: string;
}

export interface PedidoCreate {
  bubble_tea_id: number;
  cantidad: number;
  estado?: string;
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}/pedidos`);
  }

  createPedido(pedido: PedidoCreate): Observable<Pedido> {
    return this.http.post<Pedido>(`${this.apiUrl}/pedidos`, pedido);
  }

  updatePedido(id: number, pedido: Partial<PedidoCreate>): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.apiUrl}/pedidos/${id}`, pedido);
  }

  deletePedido(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/pedidos/${id}`);
  }

 

}
