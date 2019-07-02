import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoStatusValidationPipe } from './pipes/todo-status-validation.pipe';
import { GetTodosFilterDto } from './dto/get-todos-filter.dto';
import { Todo } from './todo.entity';
import { TodoStatus } from './todo-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('todos')
@UseGuards(AuthGuard())
export class TodosController {
  constructor(private todosService: TodosService) {}

  @Get()
  getTodos(
    @Query(ValidationPipe) filterDto: GetTodosFilterDto,
    @GetUser() user: User,
  ): Promise<Todo[]>{
    return this.todosService.getTodos(filterDto, user);
  }

  @Get('/:id')
  getTodoById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Todo> {
    return this.todosService.getTodoById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTodo(
    @Body() createTodoDto: CreateTodoDto,
    @GetUser() user: User,
  ): Promise<Todo>{
    return this.todosService.createTodo(createTodoDto, user);
  }

  @Delete('/:id')
  deleteTodo(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<void> {
    return this.todosService.deleteTodo(id, user);
  }

  @Patch('/:id/status')
  updateTodoStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TodoStatusValidationPipe) status: TodoStatus,
    @GetUser() user: User,
  ): Promise<Todo> {
    return this.todosService.updateTodoStatus(id, status, user);
  }
}
