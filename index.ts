#!/usr/bin/env node

import yargs from 'yargs';
import * as fs from 'fs';
import * as path from 'path';
import { CRConsoleQuestion } from './console-question/cr.console-question';
import { CRFiler } from './filer/cr.filer';
import { IConsoleQuestion } from 'interfaces/iconsole-question';
import { IFiler } from './interfaces/ifiler';
import { Program } from './program';
import { Config } from './models/config';

const args = yargs
        .help('help', 'Show help menu.')
        .version('version', 'Show version number.', '1.2.1') 
        .option('answer', {
            alias: 'a',
            type: 'string',
            description: `Set the automatic answer value for user prompts (Y/n). 
            This can be used for build pipelines to automatically answer confirmation prompts that would block the job. 
            Non valid answer values will cancel the entire operation.`,
            default: '',
            defaultDescription: 'No automatic answer',
            demandOption: false
        })
        .option('config', {
            alias: 'c',
            type: 'string',
            description: `Extra configuration JSON file to modify or replace Copyrighter's configurations. 
            If any of the top level properties are omitted the default configuration will fill it in.

                [copyright]: string = Copyright text to embed. Use {year} where you want the year to be added.
                
                [regex]: string = Regular expression to look for the copyright text. Do not add the end character ($) 
                or files with any other data will not be picked up. Use {year} if you want to replace the copyright text 
                regardless of any year.
                
                [extensions]: object = Supported extensions for copyrighter to write into.
                [extensions.prefixTexts] (optional): array = A collection of texts that could be present at the start of the file that always needs to be there.
                [extensions.startComment] (optional): string = The starting comment string of the copyright text.
                [extensions.startCommentRegex] (optional): string = The starting comment regex of the copyright text.
                [extensions.endComment] (optional): string = The ending comment string of the copyright text.
                [extensions.endCommentRegex] (optional): string = The ending comment regex of the copyright text.
                [extensions.comment] (optional): string = The comment string on every line of the copyright text.
                [extensions.commentRegex ](optional): string = The comment regex of the copyright text.


                Extensions default: html, css, scss, less, js, ts, txt, sh, dockerfile.`,
            default: '',
            defaultDescription: 'Default configuration file',
            demandOption: false
        })
        .option('encoding', {
            alias: 'e',
            type: 'string',
            description: 'Encoding to read and write files with.',
            default: 'utf-8', 
            demandOption: false
        })
        .option('exclude-directories', {
            alias: 'x',
            type: 'array',
            description: 'Directories to be excluded from the process.',
            demandOption: false
        })
        .option('folder', {
            alias: 'f',
            type: 'string',
            description: 'Root folder from where to start the process.',
            default:  './',
            defaultDescription: 'Current working folder',
            demandOption: false
        })
        .option('file-types', {
            alias: 't',
            type: 'array',
            description: 'File types that you want to copyright.',
            demandOption: false
        })
        .option('log-mode', {
            alias: 'l',
            type: 'boolean',
            description: 'Copyright errors will be logged without causing the tool to finish with an error code.',
            demandOption: false
        }) 
        .option('remove', {
            alias: 'r',
            type: 'boolean',
            description: 'Remove the copyright text instead of adding/replacing it.',
            demandOption: false
        })   
        .option('scan', {
            alias: 's',
            type: 'boolean',
            description: 'Run the tool in scan mode.',
            demandOption: false
        })
        .option('year', {
            alias: 'y',
            type: 'number',
            description: `Set the year used by the tool. If not specified the tool will take any copyright text regardless 
            of year as valid in scan mode and use the current year for the replacement text in replace mode`,
            default: null,
            defaultDescription: 'NULL',
            demandOption: false
        })           
        .option('tommy', {
            type: 'boolean',
            description: 'What does this do Mr Tommy??',
            default: false,
            hidden: true,
        })
        .alias('help', 'h')
        .alias('version', 'v')
        .array('file-types')
        .default('file-types', [], 'All extensions supported by configuration')
        .array('exclude-directories')
        .default('exclude-directories', [], 'Default configuration excluded folders')
        .number('year')
        .boolean('remove')
        .boolean('scan')
        .boolean('tommy')
        .wrap(150)
        .argv;

const filer: IFiler = new CRFiler();
const excludeQuestion: IConsoleQuestion = new CRConsoleQuestion(args['answer']);

const program = new Program(filer, excludeQuestion);

let config = JSON.parse(fs.readFileSync(path.join(__dirname, './copyrighter.json')).toString());

if(args['config']){
    Object.assign(config, JSON.parse(fs.readFileSync(args['config']).toString()));
}

config.copyright = config.copyright.replace('{year}', args['year'] || new Date().getFullYear());

(async ()=> {
    try{
        await program.run({
            folder: args['folder'],
            fileTypes: args['file-types'],
            excludedFolders: args['exclude-directories'],
            config: new Config(config),
            logMode: args['log-mode'],
            remove: args['remove'],
            scan: args['scan'],
            year: args['year'],
            tommy: args['tommy']
        });
        
        process.exit(0);
    }catch(ex: any){
        console.error(`FAILED (Code ${ex.code || 1}): ${ex.message}`);
        process.exit(ex.code || 1);
    }
})();

