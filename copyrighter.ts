import { File } from './models/file';
import { Config } from './models/config';

export class Copyrighter{
    private readonly config: Config;

    constructor(config: Config){
        this.config = config;
    }

    public copyright(file: File, remove?: boolean): boolean{
        //In cases like Docker we need to be able to map Dockerfile as well as some.dockerfile
        const extension = this.config.extensions.find((ex) => {
            const dots = file.name.split('.');
            let fileExtension = '';

            if(dots.length > 0){
                fileExtension = dots[dots.length - 1];
            }

            return ex.name.toLowerCase() == fileExtension.toLowerCase();
        });

        //This shouldn't happen unless people try to play smart
        if(!extension){
            return false;
        }

        //If there is a comment-per-line value the original regex string needs to add a comment on every line-break so it can match
        const copyrightRegex = extension.comment ? this.config.regex.replace(/\\n/gm, `\\n${extension.commentRegex || extension.comment} `) : this.config.regex;
        const copyrightStartRegex = extension.startCommentRegex ? `${extension.startCommentRegex}\\n` : (extension.startComment ? `${extension.startComment}\\n` : (extension.comment ? `${extension.comment} `: ''));
        const copyrightEndRegex = extension.endCommentRegex ? `\\n${extension.endCommentRegex}` : (extension.endComment ? `\\n${extension.endComment}` : '');

        //Remove carriage return because Windows be stupid
        let data = file.data.replace(/[\r]+/g, '')
                    .replace(`${extension.prefixText}\n`, '')
                    .replace(new RegExp(`${copyrightStartRegex}${copyrightRegex}${copyrightEndRegex}\\n`, 'gm'), '');  
                    
        //If there is a comment-per-line value the original copyright string needs to add a comment on every line-break
        const copyright = extension.comment ? this.config.copyright.replace(/\n/gm, `\n${extension.comment} `) : this.config.copyright;
        const copyrightData = `${extension.startComment ? `${extension.startComment}\n` : `${extension.comment} `}${copyright}${extension.endComment ? `\n${extension.endComment}` : ''}\n`;
        
        if(file.data.startsWith(`${extension.prefixText}`)){
            file.data = `${extension.prefixText}\n${!remove ? copyrightData : ''}${data}`;
        }else{
            file.data = `${!remove ? copyrightData : ''}${data}`;
        }
        
        return true;
    }
}