import * as bcrypt from 'bcrypt';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DrizzleDbType } from 'types/drizzle';
import { NewUser, user } from 'src/drizzle/schema/user.schema';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { phone } from 'src/drizzle/schema/phone.schema';

const saltOrRounds: number = 10;

@Injectable()
export class UserService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDbType) {
    // console.log('DRIZZLE injected:', this.db);
    // console.log({ DRIZZLE });
  }

  async create(createUserDto: NewUser) {
    console.log({ createUserDto });

    const { phoneNumber, email, name, password } = createUserDto;

    const hashPassword = await bcrypt.hash(password, saltOrRounds);

    console.log({ hashPassword });

    const insertDataUser = await this.db
      .insert(user)
      .values({
        name,
        email,
        password: hashPassword,
      })
      .returning({ userId: user.id });

    console.log({ insertDataUser });

    const userId = insertDataUser[0].userId;

    const insertPhones = await this.db
      .insert(phone)
      .values({
        userId: userId,
        phone: createUserDto.phoneNumber,
      })
      .returning();

    console.log({ insertPhones });

    return {
      user: insertDataUser[0],
      phone: insertPhones,
    };
  }

  async findAll() {
    // return await this.db.select().from(user);
    return this.db.query.user.findMany({
      with: {
        phone: true,
      },
    });
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
