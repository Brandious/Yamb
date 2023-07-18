import { Injectable, ValidationPipe } from '@nestjs/common';

@Injectable()
export class WsValidationPipe extends ValidationPipe {
  createExceptionFactory() {
    return (validationErrors = []) => {
      if (this.isDetailedOutputDisabled) {
        return new DOMException('Bad request');
      }

      const errors = this.flattenValidationErrors(validationErrors);

      return new DOMException(errors[0]);
    };
  }
}
