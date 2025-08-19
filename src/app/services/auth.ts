import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: number;
  nombre: string;
  email: string;
  cedula: string;
  empresa: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private router: Router) {
    this.checkAuthStatus();
  }

  private checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userData = localStorage.getItem('userData');
    
    if (isLoggedIn === 'true' && userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
      } catch (error) {
        this.logout();
      }
    }
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  login(user: User) {
    localStorage.setItem('userData', JSON.stringify(user));
    localStorage.setItem('isLoggedIn', 'true');
    this.currentUserSubject.next(user);
  }

  logout() {
    localStorage.removeItem('userData');
    localStorage.removeItem('isLoggedIn');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Verificar si el usuario puede acceder a una ruta
  canActivate(): boolean {
    if (this.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
