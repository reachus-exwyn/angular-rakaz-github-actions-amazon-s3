import { Injectable } from '@angular/core';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, CacheItem<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

  constructor() {
    // Clean up expired items every minute
    setInterval(() => {
      this.cleanup();
    }, 60 * 1000);
  }

  /**
   * Set a value in cache with optional TTL
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const expiresAt = ttl ? Date.now() + ttl : undefined;
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt
    });
  }

  /**
   * Get a value from cache
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if item has expired
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  /**
   * Check if a key exists in cache and is not expired
   */
  has(key: string): boolean {
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }

    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Remove a specific item from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  /**
   * Clean up expired items
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (item.expiresAt && now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Set cache with default TTL
   */
  setWithDefaultTTL<T>(key: string, data: T): void {
    this.set(key, data, this.DEFAULT_TTL);
  }

  /**
   * Cache API responses
   */
  setApiResponse<T>(endpoint: string, data: T, ttl?: number): void {
    const key = `api:${endpoint}`;
    this.set(key, data, ttl);
  }

  /**
   * Get cached API response
   */
  getApiResponse<T>(endpoint: string): T | null {
    const key = `api:${endpoint}`;
    return this.get<T>(key);
  }

  /**
   * Invalidate API cache for specific endpoint
   */
  invalidateApiCache(endpoint: string): void {
    const key = `api:${endpoint}`;
    this.delete(key);
  }

  /**
   * Invalidate all API cache
   */
  invalidateAllApiCache(): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith('api:')) {
        this.cache.delete(key);
      }
    }
  }
} 