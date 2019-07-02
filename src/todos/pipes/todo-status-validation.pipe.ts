import { PipeTransform, BadRequestException } from '@nestjs/common';
import { TodoStatus } from '../todo-status.enum';

export class TodoStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TodoStatus.OPEN,
    TodoStatus.IN_PROGRESS,
    TodoStatus.DONE,
  ];

  transform(value: any) {
    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`"${value}" is an invalid status`);
    }

    return value;
  }

  private isStatusValid(status: any) {
    const idx = this.allowedStatuses.indexOf(status);
    return idx !== -1;
  }
}
