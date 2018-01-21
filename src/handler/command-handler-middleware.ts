import { CommandBusMiddleware } from '../command-bus-middleware';
import { Inject, Optional } from '@angular/core';
import { COMMAND_HANDLER, COMMAND_NAME_EXTRACTOR } from '../command-bus.module';
import { CommandNameExtractor } from './command-name-extractor';
import { CommandHandler } from './command-handler';

export class CommandHandlerMiddleware implements CommandBusMiddleware {
  private handlers: {[commandName: string]: CommandHandler} = {};

  constructor(
    @Optional() @Inject(COMMAND_HANDLER) handlers: CommandHandler[],
    @Inject(COMMAND_NAME_EXTRACTOR) private commandNameExtractor: CommandNameExtractor,
  ) {

    if (handlers !== null && !Array.isArray(handlers)) {
      throw new Error('Forgot multi:true in command handler provider definition?');
    }

    (handlers || []).forEach(handler => {
      if (this.handlers[handler.supportsCommand()]) {
        throw new Error('Multiple handlers not allowed for command ' + handler.supportsCommand());
      }
      this.handlers[handler.supportsCommand()] = handler;
    });
  }

  handle(command: any, next: Function): any {
    const commandName = this.commandNameExtractor.extract(command);
    const handler = this.handlers[commandName];

    if (!handler) {
      throw new Error('Missing handler for command ' + commandName);
    }

    return handler.handle(command);
  }
}
