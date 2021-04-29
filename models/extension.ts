export class Extension{
    public readonly name: string;
    public readonly prefixText: string;
    public readonly startComment: string;
    public readonly startCommentRegex: string;
    public readonly endComment: string;
    public readonly endCommentRegex: string;
    public readonly comment: string;
    public readonly commentRegex: string;

    constructor(args: any = null){
        args = args ? JSON.parse(JSON.stringify(args)) : {};
        this.name = args.name || null;
        this.prefixText = args.prefixText || null;
        this.startComment = args.startComment || null;
        this.startCommentRegex = args.startCommentRegex || null;
        this.endComment = args.endComment || null;
        this.endCommentRegex = args.endCommentRegex || null;
        this.comment = args.comment || null;
        this.commentRegex = args.commentRegex || null;
    }
}