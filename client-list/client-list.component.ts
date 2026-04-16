import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QueueService } from '../../services/queue.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="client-list-container">
      <div class="client-list-header">
        <h1>Clients</h1>
        <button class="btn btn-primary" (click)="showAddClientForm = !showAddClientForm">
          Add Client
        </button>
      </div>

      <!-- Add Client Form -->
      <div class="add-client-form" *ngIf="showAddClientForm">
        <h3>Add New Client</h3>
        <form (ngSubmit)="addClient()">
          <div class="form-group">
            <label for="clientName">Name:</label>
            <input id="clientName" type="text" [(ngModel)]="newClient.name" name="name" required>
          </div>
          <div class="form-group">
            <label for="clientContact">Contact:</label>
            <input id="clientContact" type="text" [(ngModel)]="newClient.contact" name="contact" required>
          </div>
          <div class="form-group">
            <label for="clientNotes">Notes:</label>
            <textarea id="clientNotes" [(ngModel)]="newClient.notes" name="notes"></textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Add Client</button>
            <button type="button" class="btn btn-secondary" (click)="showAddClientForm = false">Cancel</button>
          </div>
        </form>
      </div>

      <!-- Client Grid -->
      <div class="client-grid">
        <div class="client-card" 
             *ngFor="let client of clients()"
             (click)="goToClient(client.id)">
          <div class="client-header">
            <h3>{{ client.name }}</h3>
            <div class="client-actions">
              <button class="btn-small btn-danger" 
                      (click)="deleteClient(client.id); $event.stopPropagation()">
                Delete
              </button>
            </div>
          </div>
          <p class="client-contact">{{ client.contact }}</p>
          <p class="client-notes">{{ client.notes || 'No notes' }}</p>
          <div class="client-stats">
            <span class="stat">
              {{ getClientCommissionCount(client.id) }} commissions
            </span>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="clients().length === 0">
        <h3>No clients yet</h3>
        <p>Add your first client to get started!</p>
      </div>
    </div>
  `,
  styles: [`
    .client-list-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .client-list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    
    .client-list-header h1 {
      color: #2c3e50;
      margin: 0;
    }
    
    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    .btn-primary {
      background-color: #3498db;
      color: white;
    }
    
    .btn-primary:hover {
      background-color: #2980b9;
    }
    
    .btn-secondary {
      background-color: #95a5a6;
      color: white;
    }
    
    .btn-danger {
      background-color: #e74c3c;
      color: white;
    }
    
    .btn-small {
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;
    }
    
    .add-client-form {
      background: #f8f9fa;
      padding: 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }
    
    .form-group input, .form-group textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .form-actions {
      display: flex;
      gap: 1rem;
    }
    
    .client-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    
    .client-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: transform 0.3s ease;
    }
    
    .client-card:hover {
      transform: translateY(-2px);
    }
    
    .client-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .client-header h3 {
      color: #2c3e50;
      margin: 0;
    }
    
    .client-contact {
      color: #7f8c8d;
      margin-bottom: 0.5rem;
    }
    
    .client-notes {
      color: #34495e;
      margin-bottom: 1rem;
      font-style: italic;
    }
    
    .client-stats {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .stat {
      color: #3498db;
      font-weight: 600;
      font-size: 0.875rem;
    }
    
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #7f8c8d;
    }
    
    .empty-state h3 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }
    
    @media (max-width: 768px) {
      .client-list-header {
        flex-direction: column;
        gap: 1rem;
      }
      
      .client-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ClientListComponent implements OnInit {
  private queueService = inject(QueueService);
  private router = inject(Router);
  
  clients = this.queueService.clients;
  commissions = this.queueService.commissions;
  
  showAddClientForm = false;
  
  newClient = {
    name: '',
    contact: '',
    notes: ''
  };

  ngOnInit() {
    // Initialize sample data if empty
    if (this.clients().length === 0) {
      this.queueService.initializeSampleData();
    }
  }

  getClientCommissionCount(clientId: string): number {
    return this.commissions().filter(c => c.clientId === clientId).length;
  }

  addClient() {
    if (this.newClient.name && this.newClient.contact) {
      this.queueService.addClient(this.newClient);
      
      // Reset form
      this.newClient = {
        name: '',
        contact: '',
        notes: ''
      };
      this.showAddClientForm = false;
    }
  }

  deleteClient(id: string) {
    if (confirm('Are you sure you want to delete this client? This will also delete all their commissions.')) {
      // First delete all commissions for this client
      const clientCommissions = this.commissions().filter(c => c.clientId === id);
      clientCommissions.forEach(commission => {
        this.queueService.deleteCommission(commission.id);
      });
      
      // Then delete the client
      this.queueService.deleteClient(id);
    }
  }

  goToClient(id: string) {
    this.router.navigate(['/client', id]);
  }
}
