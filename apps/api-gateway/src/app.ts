import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { ApiResponse } from '@coop/shared';

export function createApp(): Application {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (req: Request, res: Response) => {
    const response: ApiResponse = {
      success: true,
      data: {
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'api-gateway',
      },
    };
    res.json(response);
  });

  app.get('/api/v1/members', (req: Request, res: Response) => {
    const response: ApiResponse = {
      success: true,
      data: {
        members: [],
        total: 0,
      },
    };
    res.json(response);
  });

  app.get('/api/v1/loans', (req: Request, res: Response) => {
    const response: ApiResponse = {
      success: true,
      data: {
        loans: [],
        total: 0,
      },
    };
    res.json(response);
  });

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    const response: ApiResponse = {
      success: false,
      error: {
        message: err.message || 'Internal Server Error',
        code: 'INTERNAL_ERROR',
      },
    };
    res.status(500).json(response);
  });

  return app;
}
