import { IFiler } from './interfaces/ifiler';
import { IConsoleQuestion } from './interfaces/iconsole';
import { IArgs } from './interfaces/iargs';
import { Copyrighter } from './copyrighter';
import { File } from './models/file';

export class Program{
    private readonly filer: IFiler;
    private readonly console: IConsoleQuestion;
    private isConfirmed: boolean;

    constructor(filer: IFiler, console: IConsoleQuestion){
        this.filer = filer;
        this.console = console;
        this.isConfirmed = true;
    }

    public async run(args: IArgs): Promise<File[]>{
        console.clear();
        if(args.tommy){
            console.log(`
                                 ,(((((,
                   (((((((((((((((((((((((((((..*(((((,
                 ((((((((((*****,**/(((((((((((((((((((((((*
               (((((##(((***,***,***,*##((((((((((((((((((((((
              ((((((((((,*******,****##(((((((((((((((((((((((((,
             (((((((((((,,,,,,,,,,###(((((((((((((((((((((((((((((
            (((((##(((((,*******,##((((((((((((((((((((((((((((((((
      ,,,,,,,,(((((.    ,***,/##((((((((((((((((((((((((((((((((((((
           (((((        ,**&%######((((((((((((((((((((((((((((((((((
           ((((            &&&&#####((((((#####(((((((((((((((((((((((*
           *((((  ((((     ##&&&&&##((((####################(((((((( (((
             ((((((((     ######  ###(((               &&&&&##((((((*   (((.
                         ######    ##(((,               #####& #(((((    ((
                         #####     ##((((                ####   .((((,    (
                       (((((#,      ##(((,             ((((##    (((((
                 #(((((((((##       ((((##           .((((((##   ((((##
                *((&&&&&&%##       (((((##       ,(((######%&&& (((((##
                #((#     (((  (((((((((###       &&&&&%((((((((((((((##
                         #(#  %%%%%%%%%%%%(      (##(#    &&&&&&&&&&&&&&#
                              #((#     #((#        ##,    (####     .###
                                                           ###       ###


                Mr. Tommy will live on!!!!!! The skates are still cool!`);
        }

        const copyrightedFiles: File[] = [];
        args.excludedFolders = args.excludedFolders.length ? args.excludedFolders : args.config.defaultExcludedFolders;
        
        //Should be a big no no to not exclude certain folders depending on the configuration like node_modules or dist folders 
        //on the default node configuration so we want the users to confirm their stupidity.
        if(args.excludedFolders.filter((dir) => args.config.defaultExcludedFolders.indexOf(dir) > -1 ).length < args.config.defaultExcludedFolders.length){
            this.isConfirmed = await this.console.confirm(`Some default excluded folders (${args.config.defaultExcludedFolders.join(',')}) are not being excluded from this operation. Are you sure about this? Y/n: (n) `,
                                                            'You do you. Don\'t make me responsible for the mess...',
                                                            'Good choice... Operation cancelled',
                                                            'n');
        }

        if(this.isConfirmed){
            if(args.fileTypes.length == 0){
                for(let extension of args.config.extensions){
                    args.fileTypes.push(extension.name)
                }
            }

            const files = await this.filer.getFiles(args.folder, args.fileTypes, args.excludedFolders, args.config.encoding);
            const copyrighter = new Copyrighter(args.config);
            for(let file of files){
                if(copyrighter.copyright(file, args.remove)){
                    try{
                        this.filer.replaceFile(file, args.config.encoding);
                        copyrightedFiles.push(file);
                        console.info(`SUCCESS: File ${file.name} copyrighted`);
                    }catch(error: any){
                        console.error(`ERROR: File ${file.name} failed to save changes.`)
                    }
                }else{
                    console.warn(`WARNING: File ${file.name} was ignored because no configuration for its type could be found`);
                }  
            }   
            
            console.info('FINISHED: Files Copyrighted.');
        }

        return copyrightedFiles;
    }
}