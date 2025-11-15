import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { ApiResponse } from '@coop/shared';
import { LoanService } from './services/loan.service';

export function createApp(): Application {
  const app = express();
  const loanService = new LoanService();

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
        service: 'loan-service',
      },
    };
    res.json(response);
  });

  app.get('/loans', async (req: Request, res: Response) => {
    try {
      const loans = await loanService.getAllLoans();
      const response: ApiResponse = {
        success: true,
        data: loans,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch loans',
        },
      };
      res.status(500).json(response);
    }
  });

  app.get('/loans/:id', async (req: Request, res: Response) => {
    try {
      const loan = await loanService.getLoanById(req.params.id);
      if (!loan) {
        const response: ApiResponse = {
          success: false,
          error: {
            message: 'Loan not found',
            code: 'NOT_FOUND',
          },
        };
        return res.status(404).json(response);
      }
      const response: ApiResponse = {
        success: true,
        data: loan,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch loan',
        },
      };
      res.status(500).json(response);
    }
  });

  app.post('/loans', async (req: Request, res: Response) => {
    try {
      const loan = await loanService.createLoan(req.body);
      const response: ApiResponse = {
        success: true,
        data: loan,
      };
      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to create loan',
        },
      };
      res.status(500).json(response);
    }
  });

  app.post('/loans/:id/approve', async (req: Request, res: Response) => {
    try {
      const loan = await loanService.approveLoan(req.params.id);
      if (!loan) {
        const response: ApiResponse = {
          success: false,
          error: {
            message: 'Loan not found or cannot be approved',
            code: 'APPROVAL_FAILED',
          },
        };
        return res.status(400).json(response);
      }
      const response: ApiResponse = {
        success: true,
        data: loan,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to approve loan',
        },
      };
      res.status(500).json(response);
    }
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
