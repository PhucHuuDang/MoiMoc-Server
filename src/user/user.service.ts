import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DrizzleDbType } from 'types/drizzle';
import { user } from 'src/drizzle/schema/user.schema';
import { DRIZZLE } from 'src/drizzle/drizzle.module';

@Injectable()
export class UserService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDbType) {
    console.log('DRIZZLE injected:', this.db);
  }

  create(createUserDto: CreateUserDto) {
    const dataTest = {
      name: 'test',
      email: '',
      phone: '',
      role: 'MEMBER',
    };
    // this.db.update()

    console.log({ createUserDto });

    const insertDataUser = this.db
      .insert(user)
      .values({
        name: createUserDto.name,
        email: createUserDto.email,
        phone: createUserDto.phone,
        // role: createUserDto.role,
      })
      .returning();
    return insertDataUser;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
