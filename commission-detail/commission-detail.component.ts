import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QueueService } from '../../services/queue.service';
import { Commission } from '../../models/commission.model';

@Component({
  selector: 'app-commission-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink, FormsModule],
  template: `
    <div class="commission-detail-container" *ngIf="commission(); else notFound">
      <div class="commission-header">
        <div class="commission-info">
          <h1>{{ commission()!.title }}</h1>
          <p class="client-name">Client: {{ getClientName(commission()!.clientId) }}</p>
          <span class="status" [class]="commission()!.status">{{ commission()!.status }}</span>
        </div>
        <div class="commission-actions">
          <button class="btn btn-secondary" (click)="goBack()">Back</button>
          <button class="btn btn-danger" (click)="deleteCommission()">Delete</button>
        </div>
      </div>

      <div class="commission-content">
        <div class="commission-details">
          <h2>Commission Details</h2>
          <div class="detail-section">
            <h3>Description</h3>
            <p>{{ commission()!.description }}</p>
          </div>
          
          <div class="detail-section">
            <h3>Status</h3>
            <select [(ngModel)]="updatedStatus" (change)="updateStatus()" class="status-select">
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div class="detail-section">
            <h3>Deadline</h3>
            <p>{{ commission()!.deadline | date:'fullDate' }}</p>
            <p class="deadline-info" [class.overdue]="isOverdue()">
              <span *ngIf="isOverdue()">⚠️ This commission is overdue!</span>
              <span *ngIf="!isOverdue()">Due in {{ daysUntilDeadline() }} days</span>
            </p>
          </div>
          
          <div class="detail-section">
            <h3>Created</h3>
            <p>{{ commission()!.createdAt | date:'fullDate' }}</p>
          </div>
        </div>

        <div class="edit-section" *ngIf="showEditForm">
          <h2>Edit Commission</h2>
          <form (ngSubmit)="saveChanges()">
            <div class="form-group">
              <label for="editTitle">Title:</label>
              <input id="editTitle" type="text" [(ngModel)]="editedCommission.title" name="title" required>
            </div>
            <div class="form-group">
              <label for="editDescription">Description:</label>
              <textarea id="editDescription" [(ngModel)]="editedCommission.description" name="description" required></textarea>
            </div>
            <div class="form-group">
              <label for="editDeadline">Deadline:</label>
              <input id="editDeadline" type="date" [(ngModel)]="editedDeadline" name="deadline" required>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Save Changes</button>
              <button type="button" class="btn btn-secondary" (click)="cancelEdit()">Cancel</button>
            </div>
          </form>
        </div>
      </div>

      <div class="action-buttons">
        <button class="btn btn-primary" (click)="toggleEditForm()">
          {{ showEditForm ? 'Cancel Edit' : 'Edit Commission' }}
        </button>
        <a routerLink="/client/{{ commission()!.clientId }}" class="btn btn-secondary">
          View Client
        </a>
      </div>
    </div>

    <ng-template #notFound>
      <div class="not-found">
        <h2>Commission Not Found</h2>
        <p>The commission you're looking for doesn't exist.</p>
        <a routerLink="/queue" class="btn btn-primary">Back to Queue</a>
      </div>
    </ng-template>
  `,
  styles: [`
    .commission-detail-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .commission-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid #eee;
    }
    
    .commission-info h1 {
      color: #2c3e50;
      margin: 0 0 1rem 0;
    }
    
    .client-name {
      color: #3498db;
      font-weight: 600;
      margin-bottom: 1rem;
    }
    
    .status {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
      display: inline-block;
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
    
    .commission-actions {
      display: flex;
      gap: 1rem;
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
    
    .btn-primary:hover {
      background-color: #2980b9;
    }
    
    .btn-secondary {
      background-color: #95a5a6;
      color: white;
    }
    
    .btn-secondary:hover {
      background-color: #7f8c8d;
    }
    
    .btn-danger {
      background-color: #e74c3c;
      color: white;
    }
    
    .btn-danger:hover {
      background-color: #c0392b;
    }
    
    .commission-content {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }
    
    .commission-details {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .commission-details h2 {
      color: #2c3e50;
      margin-top: 0;
      margin-bottom: 1.5rem;
    }
    
    .detail-section {
      margin-bottom: 2rem;
    }
    
    .detail-section:last-child {
      margin-bottom: 0;
    }
    
    .detail-section h3 {
      color: #2c3e50;
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
    }
    
    .detail-section p {
      color: #34495e;
      margin: 0;
      line-height: 1.6;
    }
    
    .status-select {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
    
    .deadline-info {
      margin-top: 0.5rem;
      font-weight: 600;
    }
    
    .deadline-info.overdue {
      color: #e74c3c;
    }
    
    .deadline-info:not(.overdue) {
      color: #27ae60;
    }
    
    .edit-section {
      background: #f8f9fa;
      padding: 2rem;
      border-radius: 8px;
      border: 1px solid #e9ecef;
    }
    
    .edit-section h2 {
      color: #2c3e50;
      margin-top: 0;
      margin-bottom: 1.5rem;
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #2c3e50;
    }
    
    .form-group input, .form-group textarea, .form-group select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
    
    .form-group textarea {
      min-height: 100px;
      resize: vertical;
    }
    
    .form-actions {
      display: flex;
      gap: 1rem;
    }
    
    .action-buttons {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
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
      .commission-header {
        flex-direction: column;
        gap: 1rem;
      }
      
      .commission-actions {
        width: 100%;
        justify-content: flex-start;
      }
      
      .action-buttons {
        flex-direction: column;
      }
      
      .btn {
        width: 100%;
        text-align: center;
      }
    }
  `]
})
export class CommissionDetailComponent implements OnInit {
  private queueService = inject(QueueService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  commission = this.queueService.getCommissionById(this.route.snapshot.params['id']);
  clients = this.queueService.clients;
  
  showEditForm = false;
  updatedStatus = '';
  editedCommission = {
    title: '',
    description: '',
    deadline: new Date()
  };
  editedDeadline = '';

  ngOnInit() {
    const commissionId = this.route.snapshot.params['id'];
    this.commission = this.queueService.getCommissionById(commissionId);
    
    if (this.commission()) {
      this.updatedStatus = this.commission()!.status;
      this.editedCommission = {
        title: this.commission()!.title,
        description: this.commission()!.description,
        deadline: this.commission()!.deadline
      };
      this.editedDeadline = this.commission()!.deadline.toISOString().split('T')[0];
    }
  }

  getClientName(clientId: string): string {
    const client = this.clients().find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  }

  isOverdue(): boolean {
    if (!this.commission()) return false;
    return new Date(this.commission()!.deadline) < new Date() && this.commission()!.status !== 'completed';
  }

  daysUntilDeadline(): number {
    if (!this.commission()) return 0;
    const today = new Date();
    const deadline = new Date(this.commission()!.deadline);
    const diffTime = deadline.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  updateStatus() {
    if (this.commission() && this.updatedStatus !== this.commission()!.status) {
      this.queueService.updateCommission(this.commission()!.id, { status: this.updatedStatus as Commission['status'] });
    }
  }

  toggleEditForm() {
    this.showEditForm = !this.showEditForm;
    if (this.showEditForm && this.commission()) {
      this.editedCommission = {
        title: this.commission()!.title,
        description: this.commission()!.description,
        deadline: this.commission()!.deadline
      };
      this.editedDeadline = this.commission()!.deadline.toISOString().split('T')[0];
    }
  }

  saveChanges() {
    if (this.commission() && this.editedDeadline) {
      this.queueService.updateCommission(this.commission()!.id, {
        title: this.editedCommission.title,
        description: this.editedCommission.description,
        deadline: new Date(this.editedDeadline)
      });
      this.showEditForm = false;
    }
  }

  cancelEdit() {
    this.showEditForm = false;
    if (this.commission()) {
      this.editedCommission = {
        title: this.commission()!.title,
        description: this.commission()!.description,
        deadline: this.commission()!.deadline
      };
    }
  }

  deleteCommission() {
    if (this.commission() && confirm('Are you sure you want to delete this commission?')) {
      this.queueService.deleteCommission(this.commission()!.id);
      this.router.navigate(['/queue']);
    }
  }

  goBack() {
    this.router.navigate(['/queue']);
  }
}
