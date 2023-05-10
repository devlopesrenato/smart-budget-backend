import {
    Injectable,
    BadRequestException,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Request } from 'express';
  import { sign } from 'jsonwebtoken';
import { PrismaService } from 'src/prisma.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
   
  
  @Injectable()
  export class AuthService {
    constructor(
      private readonly prisma: PrismaService
    ) { }
  
    public async createAccessToken(userId: number) {
      return sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
      });
    }
  
    public async createAccessTokenWithTime(userId: string, expires: string) {
      return sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: expires,
      });
    }
    
    public async validateUser(jwtPayload: JwtPayload) {      
      const user = await this.prisma.users.findUnique({
        where: {
          id: jwtPayload?.userId
        },
      });
      if (!user) {
        throw new UnauthorizedException('User not found.');
      }
      return user;
    }
  
    private jwtExtractor(request: Request): string {
      const authHeader = request.headers.authorization;
      if (!authHeader) {
        throw new BadRequestException('Token not sent.');
      }
      const [, token] = authHeader.split(' ');
  
      return token;
    }
  
    public returnJwtExtractor(): (request: Request) => string {
      return this.jwtExtractor;
    }
  }
  