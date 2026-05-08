// In-memory store for File objects — survives navigation but NOT page refresh.
// This is intentional: files cannot be serialized to localStorage.
const _store = new Map();

export const fileStore = {
  set:         (key, file)  => _store.set(key, file),
  get:         (key)        => _store.get(key) ?? null,
  setMany:     (key, files) => _store.set(key, files),
  getMany:     (key)        => _store.get(key) ?? [],
  delete:      (key)        => _store.delete(key),
  clear:       ()           => _store.clear(),
  has:         (key)        => _store.has(key) && !!_store.get(key),
};