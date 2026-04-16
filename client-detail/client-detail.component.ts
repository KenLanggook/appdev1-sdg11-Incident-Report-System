import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { QueueService } from '../../services/queue.service';
import { Client } from '../../models/client.model';
import { Commission } from '../../models/commission.model';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  template: `
    <div class="client-detail-container" *ngIf="client(); else notFound">
      <div class="client-header">
        <div class="client-info">
          <h1>{{ client()!.name }}</h1>
          <p class="contact">{{ client()!.contact }}</p>
          <p class="notes">{{ client()!.notes || 'No notes available' }}</p>
        </div>
        <div class="client-actions">
          <button class="btn btn-secondary" (click)="goBack()">Back</button>
        </div>
      </div>

      <div class="client-stats">
        <div class="stat-card">
          <h3>{{ totalCommissions() }}</h3>
          <p>Total Commissions</p>
        </div>
        <div class="stat-card">
          <h3>{{ pendingCommissions() }}</h3>
          <p>Pending</p>
        </div>
        <div class="stat-card">
          <h3>{{ inProgressCommissions() }}</h3>
          <p>In Progress</p>
        </div>
        <div class="stat-card">
          <h3>{{ completedCommissions() }}</h3>
          <p>Completed</p>
        </div>
      </div>

      <div class="commissions-section">
        <h2>Commission History</h2>
        
        <div class="filter-tabs">
          <button class="tab-btn" 
                  [class.active]="currentFilter === 'all'"
                  (click)="currentFilter = 'all'">All</button>
          <button class="tab-btn" 
                  [class.active]="currentFilter === 'pending'"
                  (click)="currentFilter = 'pending'">Pending</button>
          <button class="tab-btn" 
                  [class.active]="currentFilter === 'in-progress'"
                  (click)="currentFilter = 'in-progress'">In Progress</button>
          <button class="tab-btn" 
                  [class.active]="currentFilter === 'completed'"
                  (click)="currentFilter = 'completed'">Completed</button>
        </div>

        <div class="commissions-list">
          <div class="commission-item" 
               *ngFor="let commission of filteredCommissions()"
               (click)="goToCommission(commission.id)">
            <div class="item-header">
              <h3>{{ commission.title }}</h3>
              <span class="status" [class]="commission.status">{{ commission.status }}</span>
            </div>
            <p class="description">{{ commission.description }}</p>
            <div class="item-footer">
              <span class="deadline">Due: {{ commission.deadline | date:'mediumDate' }}</span>
              <span class="created">Created: {{ commission.createdAt | date:'mediumDate' }}</span>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="filteredCommissions().length === 0">
          <p>No commissions found for this filter.</p>
        </div>
      </div>
    </div>

    <ng-template #notFound>
      <div class="not-found">
        <h2>Client Not Found</h2>
        <p>The client you're looking for doesn't exist.</p>
        <a routerLink="/clients" class="btn btn-primary">Back to Clients</a>
      </div>
    </ng-template>
  `,
  styles: [`
    .client-detail-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .client-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid #eee;
    }
    
    .client-info h1 {
      color: #2c3e50;
      margin: 0 0 1rem 0;
    }
    
    .contact {
      color: #3498db;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    
    .notes {
      color: #7f8c8d;
      font-style: italic;
    }
    
    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-block;
    }
    
    .btn-primary {
      background-color: #3498db;
      color: white;
    }
    
    .btn-secondary {
      background-color: #95a5a6;
      color: white;
    }
    
    .client-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    
    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      text-align: center;
    }
    
    .stat-card h3 {
      font-size: 2rem;
      color: #3498db;
      margin: 0 0 0.5rem 0;
    }
    
    .stat-card p {
      color: #7f8c8d;
      margin: 0;
    }
    
    .commissions-section h2 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }
    
    .filter-tabs {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    
    .tab-btn {
      padding: 0.5rem 1rem;
      border: 1px solid #ddd;
      background: white;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.3s ease;
    }
    
    .tab-btn.active {
      background: #3498db;
      color: white;
      border-color: #3498db;
    }
    
    .commissions-list {
      display: grid;
      gap: 1rem;
    }
    
    .commission-item {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: transform 0.3s ease;
    }
    
    .commission-item:hover {
      transform: translateY(-2px);
    }
    
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .item-header h3 {
      color: #2c3e50;
      margin: 0;
    }
    
    .status {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 600;
    }
    
    .status.pending {
      background: #f39c12;
      color: white;
    }
    
    .status.in-progress {
      background: #3498db;
      color: white;
    }
    
    .status.completed {
      background: #27ae60;
      color: white;
    }
    
    .description {
      color: #34495e;
      margin-bottom: 1rem;
    }
    
    .item-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;
      color: #7f8c8d;
    }
    
    .empty-state {
      text-align: center;
      padding: 2rem;
      color: #7f8c8d;
    }
    
    .not-found {
      text-align: center;
      padding: 4rem 2rem;
    }
    
    .not-found h2 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }
    
    @media (max-width: 768px) {
      .client-header {
        flex-direction: column;
        gap: 1rem;
      }
      
      .client-stats {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .filter-tabs {
        flex-wrap: wrap;
      }
      
      .item-footer {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }
    }
  `]
})
export class ClientDetailComponent implements OnInit {
  private queueService = inject(QueueService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  client = this.queueService.getClientById(this.route.snapshot.params['id']);
  commissions = this.queueService.commissions;
  
  currentFilter: 'all' | 'pending' | 'in-progress' | 'completed' = 'all';

  ngOnInit() {
    const clientId = this.route.snapshot.params['id'];
    this.client = this.queueService.getClientById(clientId);
  }

  filteredCommissions() {
    if (!this.client()) return [];
    
    return this.commissions()
      .filter(c => c.clientId === this.client()!.id)
      .filter(commission => {
        if (this.currentFilter === 'all') return true;
        return commission.status === this.currentFilter;
      });
  }

  totalCommissions(): number {
    if (!this.client()) return 0;
    return this.commissions().filter(c => c.clientId === this.client()!.id).length;
  }

  pendingCommissions(): number {
    if (!this.client()) return 0;
    return this.commissions()
      .filter(c => c.clientId === this.client()!.id)
      .filter(c => c.status === 'pending').length;
  }

  inProgressCommissions(): number {
    if (!this.client()) return 0;
    return this.commissions()
      .filter(c => c.clientId === this.client()!.id)
      .filter(c => c.status === 'in-progress').length;
  }

  completedCommissions(): number {
    if (!this.client()) return 0;
    return this.commissions()
      .filter(c => c.clientId === this.client()!.id)
      .filter(c => c.status === 'completed').length;
  }

  goToCommission(id: string) {
    this.router.navigate(['/commission', id]);
  }

  goBack() {
    this.router.navigate(['/clients']);
  }
}
