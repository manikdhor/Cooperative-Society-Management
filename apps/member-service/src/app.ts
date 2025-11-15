import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { ApiResponse } from '@coop/shared';
import { MemberService } from './services/member.service';

export function createApp(): Application {
  const app = express();
  const memberService = new MemberService();

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
        service: 'member-service',
      },
    };
    res.json(response);
  });

  app.get('/members', async (req: Request, res: Response) => {
    try {
      const members = await memberService.getAllMembers();
      const response: ApiResponse = {
        success: true,
        data: members,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch members',
        },
      };
      res.status(500).json(response);
    }
  });

  app.get('/members/:id', async (req: Request, res: Response) => {
    try {
      const member = await memberService.getMemberById(req.params.id);
      if (!member) {
        const response: ApiResponse = {
          success: false,
          error: {
            message: 'Member not found',
            code: 'NOT_FOUND',
          },
        };
        return res.status(404).json(response);
      }
      const response: ApiResponse = {
        success: true,
        data: member,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch member',
        },
      };
      res.status(500).json(response);
    }
  });

  app.post('/members', async (req: Request, res: Response) => {
    try {
      const member = await memberService.createMember(req.body);
      const response: ApiResponse = {
        success: true,
        data: member,
      };
      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to create member',
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
