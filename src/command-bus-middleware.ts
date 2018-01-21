export interface CommandBusMiddleware {
  handle(command: any, next: Function): any;
}
