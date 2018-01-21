# Angular command bus
Implementation command bus pattern with the support middleware as Angular module

### Installation
```
npm install angular-command-bus --save
```

### Configuration

##### Module
```ts
@NgModule({
  imports: [
      CommandBusModule.forRoot()
  ]
})
export class AppModule {
}
```

### Example

##### Model
```ts
export class Order {
    constructor(private id: string, private name: string) {}
}
```

##### Command
```ts
export class CreateOrderCommand {
    constructor(readonly orderId: string, readonly name: string) {}
}
```

##### Handler
```ts
export class CreateOrderHandler implements CommandHandler {
    constructor(orderService: OrderService) {}
    
    handle(command: CreateOrderCommand) {
        const order = new Order(command.orderId, command.name);
        orderService.save(order);
    }
    
    supportsCommand(): string {
        return CreateOrderCommand.name;
    }
}
```

##### Component
```ts
@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.scss']
})
export class OrdersPageComponent {
    constructor(private commandBus: CommandBus) {}
    
    onSubmit() {
        this.commandBus.handle(new CreateOrderCommand(id, name));
    }
}
```

### Adding middleware
This is a kind of pattern Intercepting filter from Core J2EE Patterns

```ts
@NgModule({
  providers: [
      {provide: COMMAND_BUS_MIDDLEWARE, useClass: LoggingMiddleware, multi: true},
      {provide: COMMAND_BUS_MIDDLEWARE, useClass: AuthorizationMiddleware, multi: true}
  ]
})
export class AppModule {
}
```

##### Middleware class
```ts
export class LoggingMiddleware implements CommandBusMiddleware {
    /*
     * @param next this is a reference for next middleware function
     */
    handle(command, next) {
        // before code
        next(command);
        // after code
    }
}
```
if 'next' is not called, the processing of the command will be completed and further middleware, as well as the command handler, will not be executed.

For example AuthorizationMiddleware
```ts
export class AuthorizationMiddleware implements CommandBusMiddleware {
    constructor(
        private userService: UserService,
        private notificationService: NotificationService
    ) {}
    
    handle(command, next) {
        if (!userService.hasRole('ROLE_ADMIN')) {
            notificationService.alert(
                'Access denied for handle command ' + command.constructor.name
            );
            return;
        }
        
        next(command);
    }
}
```
