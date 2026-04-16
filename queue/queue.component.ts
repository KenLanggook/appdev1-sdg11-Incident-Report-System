import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { QueueService } from '../../services/queue.service';
import { Commission } from '../../models/commission.model';

@Component({
  selector: 'app-queue',
  standalone: true,
  imports: [FormsModule, CommonModule, DatePipe],
  template: `
    <div class="queue-container">
      <div class="queue-header">
        <h1>Commission Queue</h1>
        <button class="btn btn-primary" (click)="showAddCommissionForm = !showAddCommissionForm">
          Add Commission
        </button>
      </div>

      <!-- Workload Status -->
      <div class="workload-status">
        <div class="status-card" [class.overloaded]="workloadStatus() === 'overloaded'"
             [class.busy]="workloadStatus() === 'busy'"
             [class.moderate]="workloadStatus() === 'moderate'"
             [class.light]="workloadStatus() === 'light'">
          <h3>Workload: {{ workloadStatus() | uppercase }}</h3>
          <div class="stats">
            <span>Pending: {{ pendingCount() }}</span>
            <span>In Progress: {{ inProgressCount() }}</span>
            <span>Completed: {{ completedCount() }}</span>
          </div>
        </div>
      </div>

      <!-- Next Up Section -->
      <div class="next-up-section" *ngIf="nextTask()">
        <h2>Next Up</h2>
        <div class="next-up-card" (click)="goToCommission(nextTask()!.id)">
          <h3>{{ nextTask()!.title }}</h3>
          <p>{{ getClientName(nextTask()!.clientId) }}</p>
          <p class="deadline">Deadline: {{ nextTask()!.deadline | date:'mediumDate' }}</p>
        </div>
      </div>

      <!-- Overdue Section -->
      <div class="overdue-section" *ngIf="overdueTasks().length > 0">
        <h2>⚠️ Overdue Tasks</h2>
        <div class="overdue-list">
          <div class="overdue-item" 
               *ngFor="let task of overdueTasks()"
               (click)="goToCommission(task.id)">
            <h4>{{ task.title }}</h4>
            <p>{{ getClientName(task.clientId) }} - {{ task.deadline | date:'mediumDate' }}</p>
          </div>
        </div>
      </div>

      <!-- Add Commission Form -->
      <div class="add-commission-form" *ngIf="showAddCommissionForm">
        <h3>Add New Commission</h3>
        <form (ngSubmit)="addCommission()">
          <div class="form-group">
            <label for="clientSelect">Client:</label>
            <select id="clientSelect" [(ngModel)]="newCommission.clientId" name="clientId" required>
              <option value="">Select a client</option>
              <option *ngFor="let client of clients()" [value]="client.id">
                {{ client.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="title">Title:</label>
            <input id="title" type="text" [(ngModel)]="newCommission.title" name="title" required>
          </div>
          <div class="form-group">
            <label for="description">Description:</label>
            <textarea id="description" [(ngModel)]="newCommission.description" name="description" required></textarea>
          </div>
          <div class="form-group">
            <label for="deadline">Deadline:</label>
            <input id="deadline" type="date" [(ngModel)]="newDeadline" name="deadline" required>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Add Commission</button>
            <button type="button" class="btn btn-secondary" (click)="showAddCommissionForm = false">Cancel</button>
          </div>
        </form>
      </div>

      <!-- Queue List -->
      <div class="queue-list">
        <h2>Queue</h2>
        <div class="queue-filters">
          <button class="filter-btn" 
                  [class.active]="currentFilter === 'all'"
                  (click)="currentFilter = 'all'">All</button>
          <button class="filter-btn" 
                  [class.active]="currentFilter === 'pending'"
                  (click)="currentFilter = 'pending'">Pending</button>
          <button class="filter-btn" 
                  [class.active]="currentFilter === 'in-progress'"
                  (click)="currentFilter = 'in-progress'">In Progress</button>
          <button class="filter-btn" 
                  [class.active]="currentFilter === 'completed'"
                  (click)="currentFilter = 'completed'">Completed</button>
        </div>
        
        <div class="queue-items">
          <div class="queue-item" 
               *ngFor="let commission of filteredCommissions()"
               [class.overdue]="isOverdue(commission)"
               (click)="goToCommission(commission.id)">
            <div class="item-header">
              <h3>{{ commission.title }}</h3>
              <span class="status" [class]="commission.status">{{ commission.status }}</span>
            </div>
            <p class="client-name">{{ getClientName(commission.clientId) }}</p>
            <p class="description">{{ commission.description }}</p>
            <div class="item-footer">
              <span class="deadline">Due: {{ commission.deadline | date:'mediumDate' }}</span>
              <div class="item-actions">
                <button class="btn-small" 
                        (click)="updateStatus(commission.id, getNextStatus(commission.status)); $event.stopPropagation()">
                  {{ getNextStatus(commission.status) }}
                </button>
                <button class="btn-small btn-danger" 
                        (click)="deleteCommission(commission.id); $event.stopPropagation()">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .queue-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .queue-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    
    .queue-header h1 {
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
      margin-left: 0.5rem;
    }
    
    .workload-status {
      margin-bottom: 2rem;
    }
    
    .status-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      border-left: 4px solid #95a5a6;
    }
    
    .status-card.light {
      border-left-color: #27ae60;
    }
    
    .status-card.moderate {
      border-left-color: #f39c12;
    }
    
    .status-card.busy {
      border-left-color: #e67e22;
    }
    
    .status-card.overloaded {
      border-left-color: #e74c3c;
    }
    
    .stats {
      display: flex;
      gap: 2rem;
      margin-top: 1rem;
    }
    
    .next-up-section, .overdue-section {
      margin-bottom: 2rem;
    }
    
    .next-up-card {
      background: #3498db;
      color: white;
      padding: 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      transition: transform 0.3s ease;
    }
    
    .next-up-card:hover {
      transform: translateY(-2px);
    }
    
    .overdue-list {
      display: grid;
      gap: 1rem;
    }
    
    .overdue-item {
      background: #e74c3c;
      color: white;
      padding: 1rem;
      border-radius: 8px;
      cursor: pointer;
    }
    
    .add-commission-form {
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
    
    .form-group input, .form-group select, .form-group textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .form-actions {
      display: flex;
      gap: 1rem;
    }
    
    .queue-filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    
    .filter-btn {
      padding: 0.5rem 1rem;
      border: 1px solid #ddd;
      background: white;
      cursor: pointer;
      border-radius: 4px;
    }
    
    .filter-btn.active {
      background: #3498db;
      color: white;
      border-color: #3498db;
    }
    
    .queue-items {
      display: grid;
      gap: 1rem;
    }
    
    .queue-item {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: transform 0.3s ease;
    }
    
    .queue-item:hover {
      transform: translateY(-2px);
    }
    
    .queue-item.overdue {
      border-left: 4px solid #e74c3c;
    }
    
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
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
    
    .client-name {
      color: #7f8c8d;
      margin-bottom: 0.5rem;
    }
    
    .description {
      color: #34495e;
      margin-bottom: 1rem;
    }
    
    .item-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .deadline {
      color: #e74c3c;
      font-weight: 600;
    }
    
    .item-actions {
      display: flex;
    }
    
    @media (max-width: 768px) {
      .queue-header {
        flex-direction: column;
        gap: 1rem;
      }
      
      .stats {
        flex-direction: column;
        gap: 0.5rem;
      }
      
      .item-footer {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
    }
  `]
})
export class QueueComponent implements OnInit {
  private queueService = inject(QueueService);
  private router = inject(Router);
  
  // Signals from service
  commissions = this.queueService.commissions;
  clients = this.queueService.clients;
  nextTask = this.queueService.nextTask;
  overdueTasks = this.queueService.overdueTasks;
  workloadStatus = this.queueService.workloadStatus;
  completedCount = this.queueService.completedCount;
  pendingCount = this.queueService.pendingCount;
  inProgressCount = this.queueService.inProgressCount;
  
  // Component state
  showAddCommissionForm = false;
  currentFilter: 'all' | 'pending' | 'in-progress' | 'completed' = 'all';
  
  newCommission = {
    clientId: '',
    title: '',
    description: '',
    status: 'pending' as const
  };
  
  newDeadline = '';

  ngOnInit() {
    // Initialize sample data if empty
    if (this.commissions().length === 0) {
      this.queueService.initializeSampleData();
    }
  }

  filteredCommissions() {
    return this.commissions().filter(commission => {
      if (this.currentFilter === 'all') return true;
      return commission.status === this.currentFilter;
    });
  }

  getClientName(clientId: string): string {
    const client = this.clients().find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  }

  isOverdue(commission: Commission): boolean {
    return commission.status !== 'completed' && new Date(commission.deadline) < new Date();
  }

  getNextStatus(currentStatus: Commission['status']): Commission['status'] {
    switch (currentStatus) {
      case 'pending': return 'in-progress';
      case 'in-progress': return 'completed';
      case 'completed': return 'completed';
      default: return 'pending';
    }
  }

  addCommission() {
    if (this.newCommission.clientId && this.newCommission.title && this.newCommission.description && this.newDeadline) {
      this.queueService.addCommission({
        ...this.newCommission,
        deadline: new Date(this.newDeadline)
      });
      
      // Reset form
      this.newCommission = {
        clientId: '',
        title: '',
        description: '',
        status: 'pending'
      };
      this.newDeadline = '';
      this.showAddCommissionForm = false;
    }
  }

  updateStatus(id: string, status: Commission['status']) {
    this.queueService.updateCommission(id, { status });
  }

  deleteCommission(id: string) {
    if (confirm('Are you sure you want to delete this commission?')) {
      this.queueService.deleteCommission(id);
    }
  }

  goToCommission(id: string) {
    this.router.navigate(['/commission', id]);
  }
}
