import { Todo } from './todo.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoStatus } from './todo-status.enum';
import { GetTodosFilterDto } from './dto/get-todos-filter.dto';
import { User } from 'src/auth/user.entity';

@EntityRepository(Todo)
export class TodoRepository extends Repository<Todo> {

  async getTodos(filterDto: GetTodosFilterDto, user: User): Promise<Todo[]>{
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('todo');

    query.where('todo.userId = :userId', { userId: user.id });

    if(status){
      query.andWhere('todo.status = :status', { status });
    }

    if(search){
      query.andWhere('(todo.title LIKE :search OR todo.description LIKE :search)', { search: `%${search}%` });
    }

    const todos = await query.getMany();
    return todos;
  }

  async createTodo(createTodoDto: CreateTodoDto, user: User): Promise<Todo>{
    const { title, description } = createTodoDto;

    const todo = new Todo();
    todo.title = title;
    todo.description = description;
    todo.status = TodoStatus.OPEN;
    todo.user = user;
    await todo.save();

    delete todo.user;

    return todo;
  }
}
