import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthResponse, LoginPayload, UserProfile } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'spa-user';
  private readonly tokenKey = 'spa-token';
  private userSubject = new BehaviorSubject<UserProfile | null>(this.loadUser());
  public currentUser$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) { }

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/login`, payload)
      .pipe(
        tap(response => {
          this.saveSession(response);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.tokenKey);
    this.userSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey) && !!this.userSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): UserProfile | null {
    return this.userSubject.value;
  }

  hasRole(role: string): boolean {
    return this.userSubject.value?.role === role;
  }

  private saveSession(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.storageKey, JSON.stringify(response.user));
    this.userSubject.next(response.user);
  }

  private loadUser(): UserProfile | null {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : null;
  }
}
