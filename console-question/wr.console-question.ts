import { IConsoleQuestion } from '../interfaces/iconsole';
import * as readline from 'readline';

export class WRConsoleQuestion implements IConsoleQuestion{
    private readonly answer: string;

    constructor(answer: string){
        this.answer = answer;
    }

    private async ask(question: string): Promise<string>{
        return new Promise((resolve) => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
    
            rl.question(question, (answer: string) => {
                rl.close();
                resolve(answer);
            });
        });
    }

    public async confirm(question: string, yes: string, no: string, defaultAnswer: string): Promise<boolean>{
        let valid: boolean = false;
        let confirmed: boolean = false;

        do{
            const answer = (this.answer || await this.ask(question)) || defaultAnswer;
            console.clear();
            switch(answer.toLowerCase().trim()){
                case 'y':
                case 'yes':
                    console.warn(yes);
                    confirmed = true;
                    valid = true;
                    break;
                case 'n':
                case 'no':
                    console.log(no);
                    valid = true;
                    break;
                default:
                    if(this.answer){
                        console.warn(`Automatic answer ${answer} is not valid. Cancelling operation to avoid infinite loop.`);
                        valid = true;
                    }else{
                        console.warn('Option is not valid');
                    }
                    break;        
            }
        }while(!valid); 
        
        return confirmed;
    }
}