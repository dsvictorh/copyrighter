export class File{
    public readonly path: string;
    public readonly name: string;
    public data: string;

    constructor(args: any = null){
        args = args ? JSON.parse(JSON.stringify(args)) : {};
        this.path = args.path || null;
        this.name = args.name || null;
        this.data = args.data || null;
    }
}