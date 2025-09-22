import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SecureStorageService {
  private readonly ENCRYPTION_KEY = 'rakaz-app-key-2024';
  private readonly PREFIX = 'secure_';

  constructor() {}

  /**
   * Simple encryption function (for production, use a proper encryption library)
   */
  private encrypt(data: string): string {
    try {
      // Simple XOR encryption (replace with proper encryption in production)
      let encrypted = '';
      for (let i = 0; i < data.length; i++) {
        const charCode = data.charCodeAt(i) ^ this.ENCRYPTION_KEY.charCodeAt(i % this.ENCRYPTION_KEY.length);
        encrypted += String.fromCharCode(charCode);
      }
      return btoa(encrypted); // Base64 encode
    } catch (error) {
      console.error('Encryption failed:', error);
      return data;
    }
  }

  /**
   * Simple decryption function
   */
  private decrypt(encryptedData: string): string {
    try {
      const decoded = atob(encryptedData); // Base64 decode
      let decrypted = '';
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i) ^ this.ENCRYPTION_KEY.charCodeAt(i % this.ENCRYPTION_KEY.length);
        decrypted += String.fromCharCode(charCode);
      }
      return decrypted;
    } catch (error) {
      console.error('Decryption failed:', error);
      return encryptedData;
    }
  }

  /**
   * Set secure data
   */
  setSecureItem(key: string, value: any): boolean {
    try {
      const fullKey = this.PREFIX + key;
      const jsonValue = JSON.stringify(value);
      const encryptedValue = this.encrypt(jsonValue);
      sessionStorage.setItem(fullKey, encryptedValue);
      return true;
    } catch (error) {
      console.error('Failed to set secure item:', error);
      return false;
    }
  }

  /**
   * Get secure data
   */
  getSecureItem<T>(key: string): T | null {
    try {
      const fullKey = this.PREFIX + key;
      const encryptedValue = sessionStorage.getItem(fullKey);
      
      if (!encryptedValue) {
        return null;
      }

      const decryptedValue = this.decrypt(encryptedValue);
      return JSON.parse(decryptedValue);
    } catch (error) {
      console.error('Failed to get secure item:', error);
      return null;
    }
  }

  /**
   * Remove secure data
   */
  removeSecureItem(key: string): boolean {
    try {
      const fullKey = this.PREFIX + key;
      sessionStorage.removeItem(fullKey);
      return true;
    } catch (error) {
      console.error('Failed to remove secure item:', error);
      return false;
    }
  }

  /**
   * Check if secure item exists
   */
  hasSecureItem(key: string): boolean {
    const fullKey = this.PREFIX + key;
    return sessionStorage.getItem(fullKey) !== null;
  }

  /**
   * Clear all secure data
   */
  clearSecureData(): void {
    try {
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.startsWith(this.PREFIX)) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Failed to clear secure data:', error);
    }
  }

  /**
   * Set authentication token securely
   */
  setAuthToken(token: string): boolean {
    return this.setSecureItem('auth_token', token);
  }

  /**
   * Get authentication token
   */
  getAuthToken(): string | null {
    return this.getSecureItem<string>('auth_token');
  }

  /**
   * Set user data securely
   */
  setUserData(userData: any): boolean {
    return this.setSecureItem('user_data', userData);
  }

  /**
   * Get user data
   */
  getUserData(): any {
    return this.getSecureItem('user_data');
  }

  /**
   * Set user role securely
   */
  setUserRole(role: string): boolean {
    return this.setSecureItem('user_role', role);
  }

  /**
   * Get user role
   */
  getUserRole(): string | null {
    return this.getSecureItem<string>('user_role');
  }

  /**
   * Clear authentication data
   */
  clearAuthData(): void {
    this.removeSecureItem('auth_token');
    this.removeSecureItem('user_data');
    this.removeSecureItem('user_role');
  }
} 