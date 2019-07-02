import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { TodoStatus } from './todo-status.enum';
import { User } from 'src/auth/user.entity';

@Entity()
export class Todo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TodoStatus;

  @ManyToOne(type => User, user => user.todos, { eager: false })
  user: User

  @Column()
  userId: number;
}
