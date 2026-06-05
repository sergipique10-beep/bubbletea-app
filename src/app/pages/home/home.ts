import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { OrdersService, Pedido } from '../../services/orders';
import { BubbleTeaService, BubbleTea, BubbleTeaCreate } from '../../services/bubbletea';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  pedidos: Pedido[] = [];
  bubbleTeas: BubbleTea[] = [];
  loading = true;
  userName = '';

  selectedBubbleTeaId: number | null = null;
  cantidad = 1;
  creando = false;
  searchQuery = '';

  showNotifications = false;
  showAdminForm = false;
  newTea: BubbleTeaCreate = { name: '', temperature: 'frio', price: 0, active: true };
  creandoTea = false;

  editingId: number | null = null;
  editBubbleTeaId: number | null = null;
  editCantidad = 1;
  guardando = false;
  borrandoId: number | null = null;

  private authService = inject(AuthService);
  private ordersService = inject(OrdersService);
  private bubbleTeaService = inject(BubbleTeaService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  notificationService = inject(NotificationService);

  ngOnInit() {
    this.authService.currentUser$.subscribe(u => {
      this.userName = u?.displayName || u?.email || 'Usuario';
    });

    this.bubbleTeaService.getBubbleTeas().subscribe(teas => {
      this.bubbleTeas = teas;
    });

    this.loadPedidos();
    this.notificationService.loadNotifications();
  }

  loadPedidos() {
    this.loading = true;
    this.ordersService.getPedidos().subscribe({
      next: pedidos => {
        this.pedidos = pedidos;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  createPedido() {
    if (!this.selectedBubbleTeaId || this.cantidad < 1) return;
    this.creando = true;
    this.ordersService.createPedido({
      bubble_tea_id: this.selectedBubbleTeaId,
      cantidad: this.cantidad,
    }).subscribe({
      next: () => {
        this.selectedBubbleTeaId = null;
        this.cantidad = 1;
        this.creando = false;
        this.cdr.detectChanges();
        this.loadPedidos();
      },
      error: () => {
        this.creando = false;
        this.cdr.detectChanges();
      }
    });
  }

  get filteredBubbleTeas() {
    const q = this.searchQuery.toLowerCase().trim();
    return q ? this.bubbleTeas.filter(t => t.name.toLowerCase().includes(q)) : this.bubbleTeas;
  }

  getBubbleTeaName(id: number): string {
    return this.bubbleTeas.find(t => t.id === id)?.name ?? `#${id}`;
  }

  getTeaIcon(tea: BubbleTea): string {
    const name = tea.name.toLowerCase();
    if (name.includes('taro')) return '💜';
    if (name.includes('matcha')) return '🍵';
    if (name.includes('mango')) return '🥭';
    if (name.includes('fresa') || name.includes('strawberry')) return '🍓';
    if (name.includes('chocolate')) return '🍫';
    if (name.includes('vainilla') || name.includes('vanilla')) return '🍦';
    if (name.includes('limon') || name.includes('lemon')) return '🍋';
    if (name.includes('coco') || name.includes('coconut')) return '🥥';
    return tea.temperature === 'caliente' ? '☕' : '🧋';
  }

  getTeaIconById(id: number): string {
    const tea = this.bubbleTeas.find(t => t.id === id);
    return tea ? this.getTeaIcon(tea) : '🧋';
  }

  startEdit(pedido: Pedido) {
    this.editingId = pedido.id;
    this.editBubbleTeaId = pedido.bubble_tea_id;
    this.editCantidad = pedido.cantidad;
  }

  cancelEdit() {
    this.editingId = null;
  }

  saveEdit() {
    if (!this.editingId || !this.editBubbleTeaId || this.editCantidad < 1) return;
    this.guardando = true;
    this.ordersService.updatePedido(this.editingId, {
      bubble_tea_id: this.editBubbleTeaId,
      cantidad: this.editCantidad,
    }).subscribe({
      next: () => {
        this.guardando = false;
        this.editingId = null;
        this.cdr.detectChanges();
        this.loadPedidos();
      },
      error: () => {
        this.guardando = false;
        this.cdr.detectChanges();
      }
    });
  }

  deletePedido(id: number) {
    this.borrandoId = id;
    this.ordersService.deletePedido(id).subscribe({
      next: () => {
        this.borrandoId = null;
        this.cdr.detectChanges();
        this.loadPedidos();
      },
      error: () => {
        this.borrandoId = null;
        this.cdr.detectChanges();
      }
    });
  }

  createBubbleTea() {
    if (!this.newTea.name || this.newTea.price <= 0) return;
    this.creandoTea = true;
    this.bubbleTeaService.createBubbleTea(this.newTea).subscribe({
      next: () => {
        this.newTea = { name: '', temperature: 'frio', price: 0, active: true };
        this.creandoTea = false;
        this.showAdminForm = false;
        this.bubbleTeaService.getBubbleTeas().subscribe(teas => {
          this.bubbleTeas = teas;
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.creandoTea = false;
        this.cdr.detectChanges();
      }
    });
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
