import { Inject } from '@angular/core';
import { CommandBusMiddleware } from './command-bus-middleware';
import { COMMAND_BUS_MIDDLEWARE } from './command-bus.module';
import { CommandHandlerMiddleware } from './handler/command-handler-middleware';

export class CommandBus {
  private readonly middlewareChain: Function;

  constructor(@Inject(COMMAND_BUS_MIDDLEWARE) private middlewares: CommandBusMiddleware[]) {
    const handlerMiddleware = middlewares.find(middleware => middleware instanceof CommandHandlerMiddleware);
    const sortedMiddlewares = middlewares.filter(middleware => middleware !== handlerMiddleware);
    sortedMiddlewares.push(handlerMiddleware);

    this.middlewareChain = this.createExecutionChain(sortedMiddlewares);
  }

  handle(command: Object): void {
    this.middlewareChain(command);
  }

  private createExecutionChain(middlewares: CommandBusMiddleware[]) {
    let lastCallable: Function = () => {};
    let middleware: CommandBusMiddleware;

    while (middleware = middlewares.pop()) {
      const middlewareLocal = middleware;
      const next = lastCallable;

      lastCallable = (command: Object) => {
        return middlewareLocal.handle(command, next);
      };
    }

    return lastCallable;
  }
}
