import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found-container">
      <div class="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist.</p>
        <a routerLink="/home" class="btn btn-primary">Go Home</a>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      text-align: center;
    }
    
    .not-found-content {
      max-width: 500px;
    }
    
    .not-found-content h1 {
      font-size: 6rem;
      color: #e74c3c;
      margin: 0;
      font-weight: bold;
    }
    
    .not-found-content h2 {
      font-size: 2rem;
      color: #2c3e50;
      margin: 1rem 0;
    }
    
    .not-found-content p {
      color: #7f8c8d;
      font-size: 1.1rem;
      margin-bottom: 2rem;
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
  `]
})
export class NotFoundComponent {}
