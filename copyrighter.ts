import { File } from './models/file';
import { Config } from './models/config';
import { Extension } from './models/extension';

export class Copyrighter{
    private readonly config: Config;
    private readonly year?: number;

    constructor(config: Config, year?: number){
        this.config = config;
        this.year = year;
    }

    public scan(file: File): boolean | null{
        const extension = this.getExtension(file);

        if(!extension){
            return null;
        }

        //Remove carriage return because Windows be stupid
        let data = (file.data || '').replace(/[\r]+/g, '');
        return new RegExp(this.getRegexString(extension, true), 'gm').test(data);
    }

    public copyright(file: File, remove?: boolean): boolean{
        const extension = this.getExtension(file);
        let filePrefixText;

        if(!extension){
            return false;
        }
        
        //Remove carriage return because Windows be stupid
        let data = (file.data || '').replace(/[\r]+/g, '');

        for(let prefixText of extension.prefixTexts){
            if(data.startsWith(`${prefixText}\n`)){
                data = data.replace(`${prefixText}\n`, '');
                filePrefixText = prefixText;
                break;
            }
        }
                    
        data = data.replace(new RegExp(this.getRegexString(extension), 'gm'), '');  
                    
        //If there is a comment-per-line value the original copyright string needs to add a comment on every line-break
        const copyright = extension.comment ? this.config.copyright.replace(/\n/gm, `\n${extension.comment} `) : this.config.copyright;
        const copyrightData = `${extension.startComment ? `${extension.startComment}\n` : `${extension.comment} `}${copyright}${extension.endComment ? `\n${extension.endComment}` : ''}\n`;
        
        if(file.data && filePrefixText){
            file.data = `${filePrefixText}\n${!remove ? copyrightData : ''}${data}`;
        }else{
            file.data = `${!remove ? copyrightData : ''}${data}`;
        }
        
        return true;
    }

    private getRegexString(extension: Extension, exactYear: boolean = false): string{
        //If there is a comment-per-line value the original regex string needs to add a comment on every line-break so it can match
        const copyright = this.config.regex.replace('{year}', (exactYear && this.year) ? this.year.toString() : '[0-9]+');
        const copyrightRegex = extension.comment ? copyright.replace(/\\n/gm, `\\n${extension.commentRegex || extension.comment} `) : copyright;
        const copyrightStartRegex = extension.startCommentRegex ? `${extension.startCommentRegex}\\n` : (extension.startComment ? `${extension.startComment}\\n` : (extension.comment ? `${extension.comment} `: ''));
        const copyrightEndRegex = extension.endCommentRegex ? `\\n${extension.endCommentRegex}` : (extension.endComment ? `\\n${extension.endComment}` : '');

        return `${copyrightStartRegex}${copyrightRegex}${copyrightEndRegex}\\n`;
    }

    private getExtension(file: File): Extension | undefined{
        //In cases like Docker we need to be able to map Dockerfile as well as file.dockerfile
        const extension = this.config.extensions.find((ex) => {
            const dots = file.name.split('.');
            let fileExtension = '';

            if(dots.length > 0){
                fileExtension = dots[dots.length - 1];
            }

            return ex.name.toLowerCase() == fileExtension.toLowerCase();
        });

        return extension;
    }
}