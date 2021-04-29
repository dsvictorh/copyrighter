import { Extension } from './extension';

export class Config{
    public readonly copyright: string;
    public readonly regex: string;
    public readonly extensions: Extension[];
    public readonly encoding: BufferEncoding;
    public readonly defaultExcludedFolders: string[];

    constructor(args: any = null){
        args = args ? JSON.parse(JSON.stringify(args)) : {};
        this.copyright = args.copyright || '';
        this.regex = args.regex || null;
        this.encoding = args.encoding || 'utf-8';
        this.defaultExcludedFolders = args.defaultExcludedFolders || [];
        this.extensions = [];

        const extensions = args.extensions || {};
        for(let extension in extensions){
            this.extensions.push(new Extension({
                name: extension,
                ...extensions[extension]
            }))
        }
    }
}