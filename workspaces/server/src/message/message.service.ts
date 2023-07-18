import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Message from './message.entity';
import { Repository } from 'typeorm';

export class MessageService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
  ) {}

  async getAllMessage() {
    const messages = this.messageRepository.find();

    return messages;
  }

  async getMessageById(id: number) {
    const message = this.messageRepository.findOne({
      where: { id },
    });

    if (message) return message;

    throw new NotFoundException('Message not found');
  }

  async createMessage(content: string) {
    const newMessage = await this.messageRepository.create({ content });

    await this.messageRepository.save(newMessage);
    return newMessage;
  }
}
