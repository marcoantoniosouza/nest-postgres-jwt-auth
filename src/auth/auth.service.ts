import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/models/user/create-user.dto';
import { User } from 'src/models/user/user.entity';
import { UsersService } from '../users/users.service';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && user.password === this.hashPassword(pass)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, id: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(signupDto: CreateUserDto): Promise<User> {
    signupDto.password = this.hashPassword(signupDto.password);
    return await this.usersService.create(signupDto);
  }

  hashPassword(password: string): string {
    const passwordHash = crypto
      .scryptSync(password, this.configService.get<string>('PWD_SALT'), 64)
      .toString('Hex');
    return passwordHash;
  }
}
