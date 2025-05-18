import { genSalt, hash } from 'bcrypt';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @BeforeInsert()
  async passwordHash() {
    let password = this.password;
    let pwdHash = await hash(password, await genSalt(14));
    this.password = pwdHash;
  }
}
