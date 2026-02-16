import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/database/postgres/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>) {
    return this.userRepository.save(userData);
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }
  async findById(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }
}
