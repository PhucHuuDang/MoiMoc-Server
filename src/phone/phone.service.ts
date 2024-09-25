import { Inject, Injectable } from '@nestjs/common';
import { CreatePhoneDto } from './dto/create-phone.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDbType } from 'types/drizzle';
import { NewPhoneNumber, phones } from 'src/drizzle/schema/phones.schema';

@Injectable()
export class PhoneService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDbType) {
    // console.log('DRIZZLE injected:', this.db);
    // console.log({ DRIZZLE });
  }

  create(createPhoneDto: NewPhoneNumber) {
    console.log({ createPhoneDto });
    return this.db.insert(phones).values(createPhoneDto).returning();
  }

  findAll() {
    console.log('get all phones');
    return this.db.query.phones.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} phone`;
  }

  update(id: number, updatePhoneDto: UpdatePhoneDto) {
    return `This action updates a #${id} phone`;
  }

  remove(id: number) {
    return `This action removes a #${id} phone`;
  }
}
