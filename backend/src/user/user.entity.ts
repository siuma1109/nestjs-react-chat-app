import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  Unique,
  BeforeCreate,
} from 'sequelize-typescript';
import * as bcrypt from 'bcryptjs';

@Table
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: bigint;

  @Unique
  @Column
  email: string;

  @Column
  name: string;

  @Column
  password: string;

  @BeforeCreate
  static async hashPassword(user: User) {
    if (user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(
        user.getDataValue('password'),
        salt,
      );
      return user.setDataValue('password', hashedPassword);
    }
  }
}
