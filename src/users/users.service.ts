import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/models/user/create-user.dto';
import { Repository } from 'typeorm';
import { User } from '../models/user/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findById(userId: string): Promise<User> {
    const user = this.userRepository.findOne({ id: userId });

    if (!user) throw new NotFoundException({ message: 'User not found' });

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = this.userRepository.findOne({ username: username });

    if (!user) throw new NotFoundException({ message: 'User not found' });

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = this.userRepository.findOne({ email: email });

    if (!user) throw new NotFoundException({ message: 'User not found' });

    return user;
  }
}
