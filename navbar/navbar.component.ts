import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="nav-brand">
        <h1>Artist Queue</h1>
      </div>
      <ul class="nav-links">
        <li class="dropdown">
          <button class="dropdown-toggle" (click)="toggleDropdown('main')">
            Menu
            <span class="dropdown-arrow">▼</span>
          </button>
          <ul class="dropdown-menu" [class.show]="isDropdownOpen('main')">
            <li>
              <a routerLink="/calendar" routerLinkActive="active" (click)="closeAllDropdowns()">
                Calendar
              </a>
            </li>
            <li>
              <a routerLink="/home" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="closeAllDropdowns()">
                Home
              </a>
            </li>
          </ul>
        </li>
        <li class="dropdown">
          <button class="dropdown-toggle" (click)="toggleDropdown('manage')">
            Manage
            <span class="dropdown-arrow">▼</span>
          </button>
          <ul class="dropdown-menu" [class.show]="isDropdownOpen('manage')">
            <li>
              <a routerLink="/queue" routerLinkActive="active" (click)="closeAllDropdowns()">
                Queue
              </a>
            </li>
            <li>
              <a routerLink="/clients" routerLinkActive="active" (click)="closeAllDropdowns()">
                Clients
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  `,
  styles: [`
    .navbar {
      background-color: #2c3e50;
      color: white;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .nav-brand h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
    }
    
    .nav-links {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 2rem;
    }
    
    .dropdown {
      position: relative;
    }
    
    .dropdown-toggle {
      background: none;
      border: none;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 600;
      transition: background-color 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .dropdown-toggle:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .dropdown-arrow {
      font-size: 0.8rem;
      transition: transform 0.3s ease;
    }
    
    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      background: white;
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      min-width: 150px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.3s ease;
      z-index: 1000;
      margin-top: 0.5rem;
    }
    
    .dropdown-menu.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    
    .dropdown-menu li {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    
    .dropdown-menu a {
      display: block;
      padding: 0.75rem 1rem;
      color: #2c3e50;
      text-decoration: none;
      transition: background-color 0.3s ease;
    }
    
    .dropdown-menu a:hover {
      background-color: #f8f9fa;
    }
    
    .dropdown-menu a.active {
      background-color: #3498db;
      color: white;
    }
    
    @media (max-width: 768px) {
      .navbar {
        flex-direction: column;
        gap: 1rem;
      }
      
      .nav-links {
        gap: 1rem;
        flex-wrap: wrap;
        justify-content: center;
      }
    }
  `]
})
export class NavbarComponent {
  openDropdowns: Set<string> = new Set();

  toggleDropdown(name: string) {
    if (this.openDropdowns.has(name)) {
      this.openDropdowns.delete(name);
    } else {
      this.openDropdowns.clear();
      this.openDropdowns.add(name);
    }
  }

  isDropdownOpen(name: string): boolean {
    return this.openDropdowns.has(name);
  }

  closeAllDropdowns() {
    this.openDropdowns.clear();
  }
}
