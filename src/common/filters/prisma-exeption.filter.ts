import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '../../generated/prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.error(exception.message);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    switch (exception.code) {
      case 'P2002':
        {
          const status = HttpStatus.CONFLICT;
          response.status(status).json({
            statusCode: status,
            message: `Une ressource avec ces informations existe déjà`,
          });
        }
        break;
      case 'P2025':
        {
          const status = HttpStatus.NOT_FOUND;
          response.status(status).json({
            statusCode: status,
            message: `La ressource demandée n'existe pas`,
          });
        }
        break;
      default:
        super.catch(exception, host);
        break;
    }
  }
}
