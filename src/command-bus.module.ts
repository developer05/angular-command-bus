import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { CommandBusMiddleware } from './command-bus-middleware';
import { ClassNameExtractor, CommandNameExtractor } from './handler/command-name-extractor';
import { CommandHandler } from './handler/command-handler';
import { CommandBus } from './command-bus';
import { CommandHandlerMiddleware } from './handler/command-handler-middleware';

export const COMMAND_BUS_MIDDLEWARE: InjectionToken<CommandBusMiddleware> = new InjectionToken('command_bus_middleware');
export const COMMAND_NAME_EXTRACTOR: InjectionToken<CommandNameExtractor> = new InjectionToken('command_name_extractor');
export const COMMAND_HANDLER: InjectionToken<CommandHandler> = new InjectionToken('command_handler');

@NgModule({
  imports: [],
  exports: [],
  declarations: [],
  providers: [],
})
export class CommandBusModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CommandBusModule,
      providers: [
        CommandBus,
        {provide: COMMAND_NAME_EXTRACTOR, useClass: ClassNameExtractor},
        {provide: COMMAND_BUS_MIDDLEWARE, useClass: CommandHandlerMiddleware, multi: true},
      ]
    };
  }
}
