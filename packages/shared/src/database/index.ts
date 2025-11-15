// Database configuration and connection utilities
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

export function getDatabaseConfig(): DatabaseConfig {
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'cooperative_society',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
  };
}

// Database connection interface (to be implemented per database type)
export interface DatabaseConnection {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

// PostgreSQL specific interface
export interface PostgreSQLConnection extends DatabaseConnection {
  query(sql: string, params?: any[]): Promise<any>;
}

// MongoDB specific interface  
export interface MongoDBConnection extends DatabaseConnection {
  query(collection: string, operation: string, filter?: any): Promise<any>;
}

// Example PostgreSQL implementation
export class PostgreSQLConnection implements PostgreSQLConnection {
  private client: any;
  
  async connect(): Promise<void> {
    const { Pool } = require('pg');
    const config = getDatabaseConfig();
    this.client = new Pool(config);
    await this.client.connect();
  }
  
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.end();
    }
  }
  
  async query(sql: string, params?: any[]): Promise<any> {
    const result = await this.client.query(sql, params);
    return result.rows;
  }
}

// Example MongoDB implementation
export class MongoDBConnection implements MongoDBConnection {
  private client: any;
  private db: any;
  
  async connect(): Promise<void> {
    const { MongoClient } = require('mongodb');
    const config = getDatabaseConfig();
    const uri = `mongodb://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`;
    this.client = new MongoClient(uri);
    await this.client.connect();
    this.db = this.client.db(config.database);
  }
  
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
    }
  }
  
  async query(collection: string, operation: string, filter?: any): Promise<any> {
    switch (operation) {
      case 'find':
        return this.db.collection(collection).find(filter || {}).toArray();
      case 'insert':
        return this.db.collection(collection).insertOne(filter);
      case 'update':
        return this.db.collection(collection).updateOne(filter.id, filter.update);
      case 'delete':
        return this.db.collection(collection).deleteOne(filter);
      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }
  }
}