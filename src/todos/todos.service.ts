import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { GetTodosFilterDto } from './dto/get-todos-filter.dto';
import { TodoRepository } from './todo.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { TodoStatus } from './todo-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(TodoRepository)
    private todoRepository: TodoRepository,
  ) {}

  async getTodos(filterDto: GetTodosFilterDto, user: User): Promise<Todo[]> {
    return this.todoRepository.getTodos(filterDto, user);
  }

  async getTodoById(id: number, user: User): Promise<Todo> {
    const found = await this.todoRepository.findOne({ where: { id, userId: user.id }});

    if (!found) {
      throw new NotFoundException(`Todo with ID "${id}" not found`);
    }

    return found;
  }

  async createTodo(createTodoDto: CreateTodoDto, user: User): Promise<Todo>{
    return this.todoRepository.createTodo(createTodoDto, user);
  }
  
  async deleteTodo(id: number, user: User): Promise<void> {
    const result = await this.todoRepository.delete({ id, userId: user.id });
    if(result.affected === 0){
      throw new NotFoundException(`Todo with ID "${id}" not found`);
    }
  }

  async updateTodoStatus(id: number, status: TodoStatus, user: User): Promise<Todo> {
    const todo = await this.getTodoById(id, user);
    todo.status = status;
    await todo.save();
    return todo;
  }

}
