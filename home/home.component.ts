import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="home-container">
      <div class="hero-section">
        <h1>Freelance Artist Commission Queue</h1>
        <p class="hero-description">
          Manage your commission workflow efficiently with our queue management system. 
          Track clients, deadlines, and project status all in one place.
        </p>
        <div class="cta-buttons">
          <a routerLink="/calendar" class="btn btn-primary">View Calendar</a>
          <a routerLink="/queue" class="btn btn-secondary">View Queue</a>
          <a routerLink="/clients" class="btn btn-secondary">Manage Clients</a>
        </div>
      </div>
      
      <div class="features-section">
        <h2>Key Features</h2>
        <div class="features-grid">
          <div class="feature-card">
            <h3>📋 Queue Management</h3>
            <p>Organize commissions in a FIFO queue with clear status tracking</p>
          </div>
          <div class="feature-card">
            <h3>👥 Client Management</h3>
            <p>Keep track of client information and commission history</p>
          </div>
          <div class="feature-card">
            <h3>📅 Calendar View</h3>
            <p>Visualize deadlines and workload distribution</p>
          </div>
          <div class="feature-card">
            <h3>⚡ Real-time Updates</h3>
            <p>Instant updates to queue status and workload indicators</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .hero-section {
      text-align: center;
      margin-bottom: 4rem;
    }
    
    .hero-section h1 {
      font-size: 3rem;
      color: #2c3e50;
      margin-bottom: 1rem;
    }
    
    .hero-description {
      font-size: 1.2rem;
      color: #7f8c8d;
      max-width: 600px;
      margin: 0 auto 2rem;
      line-height: 1.6;
    }
    
    .cta-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .btn {
      padding: 0.75rem 2rem;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
      display: inline-block;
    }
    
    .btn-primary {
      background-color: #3498db;
      color: white;
    }
    
    .btn-primary:hover {
      background-color: #2980b9;
      transform: translateY(-2px);
    }
    
    .btn-secondary {
      background-color: #95a5a6;
      color: white;
    }
    
    .btn-secondary:hover {
      background-color: #7f8c8d;
      transform: translateY(-2px);
    }
    
    .features-section {
      margin-top: 4rem;
    }
    
    .features-section h2 {
      text-align: center;
      font-size: 2rem;
      color: #2c3e50;
      margin-bottom: 3rem;
    }
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }
    
    .feature-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      text-align: center;
      transition: transform 0.3s ease;
    }
    
    .feature-card:hover {
      transform: translateY(-5px);
    }
    
    .feature-card h3 {
      font-size: 1.3rem;
      color: #2c3e50;
      margin-bottom: 1rem;
    }
    
    .feature-card p {
      color: #7f8c8d;
      line-height: 1.5;
    }
    
    @media (max-width: 768px) {
      .hero-section h1 {
        font-size: 2rem;
      }
      
      .cta-buttons {
        flex-direction: column;
        align-items: center;
      }
      
      .btn {
        width: 200px;
        text-align: center;
      }
    }
  `]
})
export class HomeComponent {}
