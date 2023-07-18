import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import Message from './message.entity';
import { MessageService } from './message.service';

@Controller('messages')
export class MessageController {
  private logger: Logger = new Logger('MessageController');
  constructor(private readonly messagesService: MessageService) {}

  @Get()
  async getAllMessages(): Promise<Message[]> {
    const messages = await this.messagesService.getAllMessage();
    this.logger.log(`messages: ${JSON.stringify(messages)}`);
    return messages;
  }

  @Get(':id')
  async getMessageById(@Param('id') id: string): Promise<Message | null> {
    const message = await this.messagesService.getMessageById(Number(id));
    return message;
  }

  @Post()
  async createMessage(@Body('content') content: string) {
    this.logger.log(`content: ${content}`);
    const newMessage = await this.messagesService.createMessage(content);
    return newMessage;
  }
}
