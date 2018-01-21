export interface CommandNameExtractor {
  extract(command: any): string;
}

export class ClassNameExtractor implements CommandNameExtractor {
  extract(command: any): string {
    return command.constructor.name;
  }
}
