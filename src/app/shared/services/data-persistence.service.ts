import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export enum StorageType {
  MEMORY = 'memory',
  SESSION = 'session',
  SECURE = 'secure',
  CACHE = 'cache'
}

export interface StorageItem<T> {
  data: T;
  timestamp: number;
  expiresAt?: number;
  type: StorageType;
}

@Injectable({
  providedIn: 'root'
})
export class DataPersistenceService {
  private memoryStorage = new Map<string, StorageItem<any>>();
  private cacheStorage = new Map<string, StorageItem<any>>();

  constructor() {
    // Clean up expired items every 5 minutes
    setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  /**
   * Store data with specified storage type
   */
  set<T>(
    key: string, 
    data: T, 
    type: StorageType = StorageType.MEMORY,
    ttl?: number
  ): boolean {
    try {
      const item: StorageItem<T> = {
        data,
        timestamp: Date.now(),
        expiresAt: ttl ? Date.now() + ttl : undefined,
        type
      };

      switch (type) {
        case StorageType.MEMORY:
          this.memoryStorage.set(key, item);
          break;
        case StorageType.SESSION:
          sessionStorage.setItem(key, JSON.stringify(item));
          break;
        case StorageType.SECURE:
          // Use encrypted storage for sensitive data
          const encryptedData = this.encrypt(JSON.stringify(item));
          sessionStorage.setItem(`secure_${key}`, encryptedData);
          break;
        case StorageType.CACHE:
          this.cacheStorage.set(key, item);
          break;
      }
      return true;
    } catch (error) {
      console.error('Failed to store data:', error);
      return false;
    }
  }

  /**
   * Retrieve data from storage
   */
  get<T>(key: string, type?: StorageType): T | null {
    try {
      let item: StorageItem<T> | null = null;

      // If type is specified, only check that type
      if (type) {
        item = this.getItemFromStorage<T>(key, type);
      } else {
        // Check all storage types in order of preference
        item = this.getItemFromStorage<T>(key, StorageType.MEMORY) ||
               this.getItemFromStorage<T>(key, StorageType.CACHE) ||
               this.getItemFromStorage<T>(key, StorageType.SESSION) ||
               this.getItemFromStorage<T>(key, StorageType.SECURE);
      }

      if (!item) {
        return null;
      }

      // Check if item has expired
      if (item.expiresAt && Date.now() > item.expiresAt) {
        this.delete(key, item.type);
        return null;
      }

      return item.data;
    } catch (error) {
      console.error('Failed to retrieve data:', error);
      return null;
    }
  }

  /**
   * Check if data exists in storage
   */
  has(key: string, type?: StorageType): boolean {
    const data = this.get(key, type);
    return data !== null;
  }

  /**
   * Delete data from storage
   */
  delete(key: string, type?: StorageType): boolean {
    try {
      if (type) {
        return this.deleteFromStorage(key, type);
      } else {
        // Delete from all storage types
        return this.deleteFromStorage(key, StorageType.MEMORY) ||
               this.deleteFromStorage(key, StorageType.CACHE) ||
               this.deleteFromStorage(key, StorageType.SESSION) ||
               this.deleteFromStorage(key, StorageType.SECURE);
      }
    } catch (error) {
      console.error('Failed to delete data:', error);
      return false;
    }
  }

  /**
   * Clear all data from specified storage type
   */
  clear(type?: StorageType): void {
    try {
      if (type) {
        this.clearStorage(type);
      } else {
        // Clear all storage types
        Object.values(StorageType).forEach(storageType => {
          this.clearStorage(storageType);
        });
      }
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }

  /**
   * Get storage statistics
   */
  getStats(): { [key in StorageType]: number } {
    return {
      [StorageType.MEMORY]: this.memoryStorage.size,
      [StorageType.CACHE]: this.cacheStorage.size,
      [StorageType.SESSION]: this.getSessionStorageSize(),
      [StorageType.SECURE]: this.getSecureStorageSize()
    };
  }

  // Private helper methods
  private getItemFromStorage<T>(key: string, type: StorageType): StorageItem<T> | null {
    try {
      switch (type) {
        case StorageType.MEMORY:
          return this.memoryStorage.get(key) || null;
        case StorageType.CACHE:
          return this.cacheStorage.get(key) || null;
        case StorageType.SESSION:
          const sessionData = sessionStorage.getItem(key);
          return sessionData ? JSON.parse(sessionData) : null;
        case StorageType.SECURE:
          const encryptedData = sessionStorage.getItem(`secure_${key}`);
          if (encryptedData) {
            const decryptedData = this.decrypt(encryptedData);
            return JSON.parse(decryptedData);
          }
          return null;
        default:
          return null;
      }
    } catch (error) {
      console.error(`Failed to get item from ${type} storage:`, error);
      return null;
    }
  }

  private deleteFromStorage(key: string, type: StorageType): boolean {
    try {
      switch (type) {
        case StorageType.MEMORY:
          return this.memoryStorage.delete(key);
        case StorageType.CACHE:
          return this.cacheStorage.delete(key);
        case StorageType.SESSION:
          sessionStorage.removeItem(key);
          return true;
        case StorageType.SECURE:
          sessionStorage.removeItem(`secure_${key}`);
          return true;
        default:
          return false;
      }
    } catch (error) {
      console.error(`Failed to delete from ${type} storage:`, error);
      return false;
    }
  }

  private clearStorage(type: StorageType): void {
    try {
      switch (type) {
        case StorageType.MEMORY:
          this.memoryStorage.clear();
          break;
        case StorageType.CACHE:
          this.cacheStorage.clear();
          break;
        case StorageType.SESSION:
          sessionStorage.clear();
          break;
        case StorageType.SECURE:
          // Clear only secure items
          const keys = Object.keys(sessionStorage);
          keys.forEach(key => {
            if (key.startsWith('secure_')) {
              sessionStorage.removeItem(key);
            }
          });
          break;
      }
    } catch (error) {
      console.error(`Failed to clear ${type} storage:`, error);
    }
  }

  private cleanup(): void {
    const now = Date.now();
    
    // Clean up memory storage
    for (const [key, item] of this.memoryStorage.entries()) {
      if (item.expiresAt && now > item.expiresAt) {
        this.memoryStorage.delete(key);
      }
    }

    // Clean up cache storage
    for (const [key, item] of this.cacheStorage.entries()) {
      if (item.expiresAt && now > item.expiresAt) {
        this.cacheStorage.delete(key);
      }
    }
  }

  private getSessionStorageSize(): number {
    return Object.keys(sessionStorage).length;
  }

  private getSecureStorageSize(): number {
    return Object.keys(sessionStorage).filter(key => key.startsWith('secure_')).length;
  }

  // Simple encryption/decryption (replace with proper encryption in production)
  private encrypt(data: string): string {
    return btoa(data);
  }

  private decrypt(data: string): string {
    return atob(data);
  }
} 