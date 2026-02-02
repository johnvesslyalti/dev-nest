import { Controller, Get, Param, UseGuards, UseInterceptors, UsePipes, Post, Body } from '@nestjs/common';
import { UserService } from './users.service';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { IsString, IsNotEmpty } from 'class-validator';

class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  email: string;
}

@Controller('users')
@UseGuards(ApiKeyGuard)
@UseInterceptors(TransformInterceptor)
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Post()
  @UsePipes(new ValidationPipe()) 
  // Using the custom pipe we created. 
  // Note: NestJS has built-in ValidationPipe, but we are using our custom '../common/pipes/validation.pipe'
  async createUser(@Body() createUserDto: CreateUserDto) {
    // This is just a mock because we haven't implemented create in service yet fully (or we did just pass through)
    // But for architecture demo:
    // Controller -> Pipe (validation) -> Service -> Repository
    // Interceptor (transform response) -> Response
    return { message: 'User created (mock)', data: createUserDto };
  }
}
