import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async fetchUsersFromAPI(): Promise<any[]> {
    const { data } = await firstValueFrom(
      this.httpService.get('https://jsonplaceholder.typicode.com/users'),
    );
    return data;
  }

  async saveUsersToDatabase(users: any[]): Promise<User[]> {
    const userEntities = users.map((user) => {
      const userEntity = new User();
      userEntity.id = user.id;
      userEntity.name = user.name;
      userEntity.username = user.username;
      userEntity.email = user.email;
      return userEntity;
    });

    return this.userRepository.save(userEntities);
  }

  async fetchAndSaveUsers(): Promise<void> {
    const users = await this.fetchUsersFromAPI();
    await this.saveUsersToDatabase(users);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }
}
