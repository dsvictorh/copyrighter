import { IConsoleQuestion } from '../interfaces/iconsole';

export class MockConsoleQuestion implements IConsoleQuestion{
    private readonly answer: boolean;

    constructor(answer: boolean){
        this.answer = answer
    }

    public async confirm(question: string, yes: string, no: string): Promise<boolean>{
        console.log(question);
        console.log('Auto Answering', this.answer);

        if(this.answer){
            console.log(yes);
        }else{
            console.log(no);
        }
        
        return this.answer;
    }
}