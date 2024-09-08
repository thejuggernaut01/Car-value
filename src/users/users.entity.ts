import { Report } from '../reports/report.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  // The function call in the first argument is to solve
  // circular dependency issue

  // The second argument is very specialized. THe use case of is
  // particular to how typeORM internally models relationship
  // between different entities and does validation of how all
  // these relationships are set up.

  // The second argument becomes more necessary; it's when we got
  // two different entity that are related in more than one way.

  // It takes an instance of the entity we're trying to relate to
  // and then return how to go from that target entity back to the
  // entity that we are currently defining, which is the user.
  // In the report entity, it's the opposite.
  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log(`Inserted User with id`, this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`Updated User with id`, this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log(`Removed User with id`, this.id);
  }
}
