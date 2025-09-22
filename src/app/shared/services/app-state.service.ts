import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserData {
  token?: string;
  role?: string;
  user?: any;
  permissions?: string[];
}

export interface AppState {
  user: UserData;
  isAuthenticated: boolean;
  redirectUrl?: string;
  theme?: string;
  language?: string;
  notifications?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private initialState: AppState = {
    user: {},
    isAuthenticated: false,
    theme: 'light',
    language: 'en',
    notifications: []
  };

  private stateSubject = new BehaviorSubject<AppState>(this.initialState);
  public state$ = this.stateSubject.asObservable();

  constructor() {
    // Initialize state from sessionStorage if available
    this.initializeFromSession();
  }

  // Get current state
  getState(): AppState {
    return this.stateSubject.value;
  }

  // Update state
  updateState(updates: Partial<AppState>): void {
    const currentState = this.stateSubject.value;
    const newState = { ...currentState, ...updates };
    this.stateSubject.next(newState);
    this.persistToSession(newState);
  }

  // User management
  setUser(userData: UserData): void {
    this.updateState({
      user: userData,
      isAuthenticated: !!userData.token
    });
  }

  getUser(): UserData {
    return this.stateSubject.value.user;
  }

  getToken(): string | undefined {
    return this.stateSubject.value.user.token;
  }

  getRole(): string | undefined {
    return this.stateSubject.value.user.role;
  }

  isAuthenticated(): boolean {
    return this.stateSubject.value.isAuthenticated;
  }

  // Authentication methods
  login(userData: UserData): void {
    this.setUser(userData);
  }

  logout(): void {
    this.updateState({
      user: {},
      isAuthenticated: false,
      redirectUrl: undefined
    });
    this.clearSession();
  }

  // Redirect URL management
  setRedirectUrl(url: string): void {
    this.updateState({ redirectUrl: url });
  }

  getRedirectUrl(): string | undefined {
    return this.stateSubject.value.redirectUrl;
  }

  clearRedirectUrl(): void {
    this.updateState({ redirectUrl: undefined });
  }

  // Theme management
  setTheme(theme: string): void {
    this.updateState({ theme });
  }

  getTheme(): string {
    return this.stateSubject.value.theme || 'light';
  }

  // Language management
  setLanguage(language: string): void {
    this.updateState({ language });
  }

  getLanguage(): string {
    return this.stateSubject.value.language || 'en';
  }

  // Notifications management
  addNotification(notification: any): void {
    const currentNotifications = this.stateSubject.value.notifications || [];
    this.updateState({
      notifications: [...currentNotifications, notification]
    });
  }

  removeNotification(id: string): void {
    const currentNotifications = this.stateSubject.value.notifications || [];
    this.updateState({
      notifications: currentNotifications.filter(n => n.id !== id)
    });
  }

  getNotifications(): any[] {
    return this.stateSubject.value.notifications || [];
  }

  // Session storage methods
  private persistToSession(state: AppState): void {
    try {
      // Only persist non-sensitive data to sessionStorage
      const sessionData = {
        theme: state.theme,
        language: state.language,
        notifications: state.notifications,
        redirectUrl: state.redirectUrl
      };
      sessionStorage.setItem('appState', JSON.stringify(sessionData));
    } catch (error) {
      console.warn('Failed to persist state to sessionStorage:', error);
    }
  }

  private initializeFromSession(): void {
    try {
      const sessionData = sessionStorage.getItem('appState');
      if (sessionData) {
        const parsedData = JSON.parse(sessionData);
        this.updateState(parsedData);
      }
    } catch (error) {
      console.warn('Failed to initialize from sessionStorage:', error);
    }
  }

  private clearSession(): void {
    try {
      sessionStorage.removeItem('appState');
    } catch (error) {
      console.warn('Failed to clear sessionStorage:', error);
    }
  }

  // Utility methods
  hasPermission(permission: string): boolean {
    const permissions = this.stateSubject.value.user.permissions || [];
    return permissions.includes(permission);
  }

  hasRole(role: string): boolean {
    return this.stateSubject.value.user.role === role;
  }

  isSuperAdmin(): boolean {
    return this.hasRole('super-admin');
  }

  isCustomerAdmin(): boolean {
    return this.hasRole('customer-admin');
  }

  isCustomer(): boolean {
    return this.hasRole('customer');
  }
} 