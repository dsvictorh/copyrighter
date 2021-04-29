export interface IConsoleQuestion{
    confirm(question: string, yes: string, no: string, defaultAnswer?: string): Promise<boolean>;
}