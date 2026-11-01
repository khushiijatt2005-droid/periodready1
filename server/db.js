const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class Collection {
  constructor(name) {
    this.name = name;
    this.filePath = path.join(DATA_DIR, `${name}.json`);
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2), 'utf-8');
    }
  }

  _read() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(data || '[]');
    } catch (err) {
      console.error(`Error reading ${this.name}:`, err.message);
      return [];
    }
  }

  _write(data) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error(`Error writing ${this.name}:`, err.message);
    }
  }

  async find(query = {}) {
    const items = this._read();
    if (!query || Object.keys(query).length === 0) {
      return items;
    }
    return items.filter(item => {
      for (const key of Object.keys(query)) {
        if (query[key] !== undefined && item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });
  }

  async findOne(query = {}) {
    const items = await this.find(query);
    return items[0] || null;
  }

  async findById(id) {
    const items = this._read();
    return items.find(item => item._id === id || item.id === id) || null;
  }

  async create(doc) {
    const items = this._read();
    const newDoc = {
      _id: doc._id || doc.id || uuidv4(),
      id: doc.id || doc._id || uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...doc
    };
    items.unshift(newDoc);
    this._write(items);
    return newDoc;
  }

  async insertMany(docs) {
    const items = this._read();
    const inserted = docs.map(doc => ({
      _id: doc._id || doc.id || uuidv4(),
      id: doc.id || doc._id || uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...doc
    }));
    items.unshift(...inserted);
    this._write(items);
    return inserted;
  }

  async findByIdAndUpdate(id, updates) {
    const items = this._read();
    const index = items.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;
    items[index] = {
      ...items[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this._write(items);
    return items[index];
  }

  async findByIdAndDelete(id) {
    const items = this._read();
    const index = items.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;
    const removed = items.splice(index, 1)[0];
    this._write(items);
    return removed;
  }

  async count(query = {}) {
    const items = await this.find(query);
    return items.length;
  }

  async clear() {
    this._write([]);
  }
}

const db = {
  users: new Collection('users'),
  products: new Collection('products'),
  variants: new Collection('variants'),
  carts: new Collection('carts'),
  orders: new Collection('orders'),
  addresses: new Collection('addresses'),
  coupons: new Collection('coupons'),
  payments: new Collection('payments'),
  enquiries: new Collection('enquiries'),
  salesChannels: new Collection('salesChannels'),
  content: new Collection('content')
};

module.exports = db;
