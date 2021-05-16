declare global {
  interface DateConstructor {
    fromString(dateString: string, locale: string): Date;
  }
}

export {};
