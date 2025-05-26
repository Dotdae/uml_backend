// src/app/components/graph-links-model/graph-links-model.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

interface Item {
  id: number;
  name: string;
  quantity: number;
}

interface Pedido {
  cliente: string;
  items: Item[];
}

@Component({
  selector: 'app-graph-links-model',
  templateUrl: './graph-links-model.component.html',
  styleUrls: ['./graph-links-model.component.scss']
})
export class GraphLinksModelComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  public pedidoStatus: string = ''; // To display status updates

  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  realizarPedido(items: Item[]): void {
    this.pedidoStatus = 'Realizando Pedido...';
    console.log('Realizando pedido with items:', items);
    this.crearPedido('DefaultClient', items);
  }

  crearPedido(cliente: string, items: Item[]): void {
    this.pedidoStatus = 'Creando Pedido...';
    console.log('Creando pedido for client:', cliente, 'with items:', items);
    const pedido: Pedido = { cliente: cliente, items: items };
    this.validarDatos(pedido);
  }

  validarDatos(pedido: Pedido): void {
    this.pedidoStatus = 'Validando Datos del Pedido...';
    console.log('Validando datos of pedido:', pedido);
    // Simulate validation logic
    if (pedido && pedido.items && pedido.items.length > 0) {
      this.verificarInventario(pedido.items);
    } else {
      this.pedidoStatus = 'Error: Datos del pedido inválidos.';
    }
  }

  verificarInventario(items: Item[]): void {
    this.pedidoStatus = 'Verificando Inventario...';
    console.log('Verificando inventario for items:', items);
    // Simulate inventory check
    const inventarioDisponible = true; // Replace with actual inventory check logic

    if (inventarioDisponible) {
      this.inventarioDisponible();
    } else {
      this.pedidoStatus = 'Error: Inventario insuficiente.';
    }
  }

  inventarioDisponible(): void {
    this.pedidoStatus = 'Inventario Disponible.';
    console.log('Inventario disponible.');
    this.pedidoCreado();
  }

  pedidoCreado(): void {
    this.pedidoStatus = 'Pedido Creado Exitosamente.';
    console.log('Pedido creado successfully.');
    this.confirmacionPedido();
  }

  confirmacionPedido(): void {
    this.pedidoStatus = 'Confirmando Pedido...';
    console.log('Confirming pedido.');
    // Simulate order confirmation logic
    this.actualizarInventario();
  }

  actualizarInventario(): void {
    this.pedidoStatus = 'Actualizando Inventario...';
    console.log('Actualizando inventario.');
    this.pedidoStatus = 'Pedido Completado.';
  }

  // Example interaction from the template
  onRealizarPedidoClick(): void {
    const exampleItems: Item[] = [
      { id: 1, name: 'Product A', quantity: 2 },
      { id: 2, name: 'Product B', quantity: 1 }
    ];
    this.realizarPedido(exampleItems);
  }

}