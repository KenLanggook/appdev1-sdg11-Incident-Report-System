import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { QueueService } from '../../services/queue.service';
import { Commission } from '../../models/commission.model';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <div class="calendar-container">
      <div class="calendar-header">
        <h1>Commission Calendar</h1>
        <div class="calendar-controls">
          <button class="btn btn-secondary" (click)="previousMonth()">← Previous</button>
          <span class="current-month">{{ currentMonth | date:'MMMM yyyy' }}</span>
          <button class="btn btn-secondary" (click)="nextMonth()">Next →</button>
        </div>
      </div>

      <div class="calendar-grid">
        <div class="calendar-weekdays">
          <div class="weekday" *ngFor="let day of weekdays">{{ day }}</div>
        </div>
        <div class="calendar-days">
          <div class="calendar-day" 
               *ngFor="let day of calendarDays"
               [class.other-month]="day.isOtherMonth"
               [class.today]="day.isToday"
               [class.has-commissions]="day.commissions.length > 0"
               (click)="selectDate(day.date)">
            <div class="day-number">{{ day.date.getDate() }}</div>
            <div class="day-commissions" *ngIf="day.commissions.length > 0">
              <div class="commission-dot" 
                   *ngFor="let commission of day.commissions.slice(0, 3)"
                   [class]="commission.status"
                   [title]="commission.title">
              </div>
              <div class="more-dots" *ngIf="day.commissions.length > 3">
                +{{ day.commissions.length - 3 }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Selected Date Details -->
      <div class="selected-date-details" *ngIf="selectedDate">
        <h2>{{ selectedDate | date:'fullDate' }}</h2>
        <div class="commissions-list">
          <div class="commission-item" 
               *ngFor="let commission of selectedDateCommissions()"
               (click)="goToCommission(commission.id)">
            <div class="item-header">
              <h3>{{ commission.title }}</h3>
              <span class="status" [class]="commission.status">{{ commission.status }}</span>
            </div>
            <p class="client-name">{{ getClientName(commission.clientId) }}</p>
            <p class="description">{{ commission.description }}</p>
          </div>
        </div>
        <div class="no-commissions" *ngIf="selectedDateCommissions().length === 0">
          <p>No commissions due on this date.</p>
        </div>
      </div>

      <!-- Workload Overview -->
      <div class="workload-overview">
        <h2>Workload Overview</h2>
        <div class="workload-stats">
          <div class="stat-card">
            <h3>{{ totalCommissions() }}</h3>
            <p>Total Commissions</p>
          </div>
          <div class="stat-card">
            <h3>{{ thisWeekCommissions() }}</h3>
            <p>This Week</p>
          </div>
          <div class="stat-card">
            <h3>{{ nextWeekCommissions() }}</h3>
            <p>Next Week</p>
          </div>
          <div class="stat-card">
            <h3>{{ overdueCommissions() }}</h3>
            <p>Overdue</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .calendar-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    
    .calendar-header h1 {
      color: #2c3e50;
      margin: 0;
    }
    
    .calendar-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .current-month {
      font-weight: 600;
      color: #2c3e50;
      min-width: 150px;
      text-align: center;
    }
    
    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    .btn-secondary {
      background-color: #95a5a6;
      color: white;
    }
    
    .btn-secondary:hover {
      background-color: #7f8c8d;
    }
    
    .calendar-grid {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      overflow: hidden;
      margin-bottom: 2rem;
    }
    
    .calendar-weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      background: #f8f9fa;
    }
    
    .weekday {
      padding: 1rem;
      text-align: center;
      font-weight: 600;
      color: #7f8c8d;
      border-right: 1px solid #eee;
    }
    
    .weekday:last-child {
      border-right: none;
    }
    
    .calendar-days {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
    }
    
    .calendar-day {
      min-height: 80px;
      padding: 0.5rem;
      border-right: 1px solid #eee;
      border-bottom: 1px solid #eee;
      cursor: pointer;
      transition: background-color 0.3s ease;
      position: relative;
    }
    
    .calendar-day:hover {
      background-color: #f8f9fa;
    }
    
    .calendar-day:nth-child(7n) {
      border-right: none;
    }
    
    .calendar-day.other-month {
      background-color: #fafafa;
      color: #ccc;
    }
    
    .calendar-day.today {
      background-color: #e3f2fd;
    }
    
    .calendar-day.has-commissions {
      background-color: #fff3e0;
    }
    
    .day-number {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    
    .day-commissions {
      display: flex;
      flex-wrap: wrap;
      gap: 2px;
    }
    
    .commission-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    
    .commission-dot.pending {
      background-color: #f39c12;
    }
    
    .commission-dot.in-progress {
      background-color: #3498db;
    }
    
    .commission-dot.completed {
      background-color: #27ae60;
    }
    
    .more-dots {
      font-size: 0.75rem;
      color: #7f8c8d;
      margin-left: 2px;
    }
    
    .selected-date-details {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }
    
    .selected-date-details h2 {
      color: #2c3e50;
      margin-top: 0;
      margin-bottom: 1.5rem;
    }
    
    .commissions-list {
      display: grid;
      gap: 1rem;
    }
    
    .commission-item {
      padding: 1rem;
      border: 1px solid #eee;
      border-radius: 6px;
      cursor: pointer;
      transition: transform 0.3s ease;
    }
    
    .commission-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
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
    
    .client-name {
      color: #7f8c8d;
      margin-bottom: 0.25rem;
    }
    
    .description {
      color: #34495e;
      margin: 0;
    }
    
    .no-commissions {
      text-align: center;
      padding: 2rem;
      color: #7f8c8d;
    }
    
    .workload-overview h2 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }
    
    .workload-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
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
    
    @media (max-width: 768px) {
      .calendar-header {
        flex-direction: column;
        gap: 1rem;
      }
      
      .calendar-controls {
        flex-wrap: wrap;
        justify-content: center;
      }
      
      .calendar-day {
        min-height: 60px;
        padding: 0.25rem;
      }
      
      .workload-stats {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class CalendarComponent implements OnInit {
  private queueService = inject(QueueService);
  private router = inject(Router);
  
  commissions = this.queueService.commissions;
  clients = this.queueService.clients;
  
  currentMonth = new Date();
  selectedDate: Date | null = null;
  
  weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  ngOnInit() {
    // Initialize sample data if empty
    if (this.commissions().length === 0) {
      this.queueService.initializeSampleData();
    }
  }

  get calendarDays() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const isOtherMonth = currentDate.getMonth() !== month;
      const isToday = currentDate.toDateString() === today.toDateString();
      
      const dayCommissions = this.commissions().filter(commission => {
        const commissionDate = new Date(commission.deadline);
        return commissionDate.toDateString() === currentDate.toDateString();
      });
      
      days.push({
        date: currentDate,
        isOtherMonth,
        isToday,
        commissions: dayCommissions
      });
    }
    
    return days;
  }

  previousMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1);
  }

  nextMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1);
  }

  selectDate(date: Date) {
    this.selectedDate = date;
  }

  selectedDateCommissions() {
    if (!this.selectedDate) return [];
    
    return this.commissions().filter(commission => {
      const commissionDate = new Date(commission.deadline);
      return commissionDate.toDateString() === this.selectedDate!.toDateString();
    });
  }

  getClientName(clientId: string): string {
    const client = this.clients().find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  }

  totalCommissions(): number {
    return this.commissions().length;
  }

  thisWeekCommissions(): number {
    const today = new Date();
    const weekEnd = new Date(today);
    weekEnd.setDate(today.getDate() + 7);
    
    return this.commissions().filter(commission => {
      const deadline = new Date(commission.deadline);
      return deadline >= today && deadline <= weekEnd;
    }).length;
  }

  nextWeekCommissions(): number {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() + 7);
    const weekEnd = new Date(today);
    weekEnd.setDate(today.getDate() + 14);
    
    return this.commissions().filter(commission => {
      const deadline = new Date(commission.deadline);
      return deadline >= weekStart && deadline <= weekEnd;
    }).length;
  }

  overdueCommissions(): number {
    const today = new Date();
    return this.commissions().filter(commission => {
      const deadline = new Date(commission.deadline);
      return deadline < today && commission.status !== 'completed';
    }).length;
  }

  goToCommission(id: string) {
    this.router.navigate(['/commission', id]);
  }
}
