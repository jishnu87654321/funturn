const DEFAULT_TTL_MS = 60 * 1000;

class CacheStore {
  constructor() {
    this.store = new Map();
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) {
      return null;
    }

    if (entry.expiresAt <= Date.now()) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  set(key, value, ttlMs = DEFAULT_TTL_MS) {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });

    return value;
  }

  del(key) {
    this.store.delete(key);
  }

  delByPrefix(prefix) {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
      }
    }
  }

  async getOrSet(key, producer, ttlMs = DEFAULT_TTL_MS) {
    const cached = this.get(key);
    if (cached !== null) {
      return cached;
    }

    const value = await producer();
    this.set(key, value, ttlMs);
    return value;
  }
}

module.exports = new CacheStore();
