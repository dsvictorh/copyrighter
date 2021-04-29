import { File } from '../models/file';
import { IFiler } from '../interfaces/ifiler';


export const html = `<!--
Copyright (c) 2019 Wind River Systems, Inc.

The right to copy, distribute, modify, or otherwise make use of this software may be licensed only pursuant to the terms of an applicable Wind River license agreement.
-->
<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Document</title>
</head>
<body>
</body>
</html>`;

export const css = `div{
    padding: 9px;
    margin: 10px;
}

h1{
    background: red;
}`;

export const scss = `div{
    padding: 9px;
    margin: 10px;

    h1{
        background: red;
    }
}`;

export const dockerfile = `# Copyright (c) 2019 Wind River Systems, Inc.
# 
# The right to copy, distribute, modify, or otherwise make use of this software may be licensed only pursuant to the terms of an applicable Wind River license agreement.
FROM node:14 AS compile-image

WORKDIR /opt/ng
COPY . ./
RUN export GIT_SSL_NO_VERIFY=1 && npm install --unsafe-perm

ENV PATH="./node_modules/.bin:$PATH"

RUN ng build --prod`;

export const js = `function copyright(){
    alert('We are copyrighting!!');
    /*
Copyright (c) 2019 Wind River Systems, Inc.

The right to copy, distribute, modify, or otherwise make use of this software may be licensed only pursuant to the terms of an applicable Wind River license agreement.
*/
}

function copyleft(){
    alert('We are copylefting!!');
}`;

export const ts = `#!/usr/bin/env node

export interface Config{
    files: string[],
    name: string
}

export class Copyright{
    private config: Config;
    private g: string;

    constructor(config: Config){
        this.config = config;
    }
}`;


export class MockFiler implements IFiler{
    public readonly files: File[];
    public readonly innerFiles: File[];
    public readonly nonoFiles: File[];

    constructor(){
        this.files = [
            new File({ name: 'test.html', path: './test',  data: html}),
            new File({ name: 'test.css', path: './test', data: css}),
            new File({ name: 'test.scss', path: './test', data: scss}),
            new File({ name: 'Dockerfile', path: './test', data: dockerfile}),
            new File({ name: 'test.js', path: './test', data: js}),
            new File({ name: 'test.ts', path: './test', data: ts})
        ];
        
        this.innerFiles = [
            new File({ name: 'inner-test.html', path: './inner-test',  data: html}),
            new File({ name: 'inner-test.css', path: './inner-test', data: css}),
            new File({ name: 'inner-test.scss', path: './inner-test', data: scss}),
            new File({ name: 'inner.dockerfile', path: './inner-test', data: dockerfile}),
            new File({ name: 'inner-test.js', path: './inner-test', data: js}),
            new File({ name: 'inner-test.ts', path: './inner-test', data: ts})
        ];

        this.nonoFiles = [
            new File({ name: 'nono.html', path: './nono',  data: html}),
            new File({ name: 'nono.css', path: './nono', data: css}),
            new File({ name: 'nono.scss', path: './nono', data: scss}),
            new File({ name: 'nono.dockerfile', path: './nono', data: dockerfile}),
            new File({ name: 'nono.js', path: './nono', data: js}),
            new File({ name: 'nono.ts', path: './nono', data: ts})
        ];
    }

    public async getFiles(folder: string, fileTypes: string[], excludedDirectories: string[], encoding: BufferEncoding): Promise<File[]>{
        const files: File[] = [];
        console.log('Encoding:', encoding);
        for(let fileType of fileTypes){
            switch(fileType){
                case 'html':
                    this.addFiles(folder, excludedDirectories, files, 0);
                    break;
                case 'css':
                    this.addFiles(folder, excludedDirectories, files, 1);
                    break;
                case 'scss':
                    this.addFiles(folder, excludedDirectories, files, 2);
                    break;
                case 'dockerfile':
                    this.addFiles(folder, excludedDirectories, files, 3);
                    break;
                case 'js':
                    this.addFiles(folder, excludedDirectories, files, 4);
                    break;
                case 'ts':
                    this.addFiles(folder, excludedDirectories, files, 5);
                    break;
            }
        }

        return files;
    }

    public replaceFile(file: File): void{
        console.log(`Mock replaceFile: ${file.name}.`);
    }

    private addFiles(folder: string, excludedDirectories: string[], files: any[], index: number): void{
        if(folder == './'){
            files.push(new File(this.files[index]));

            if(!excludedDirectories.some((directory) => directory == 'inner-test')){
                files.push(new File(this.innerFiles[index]));
            }
    
            if(excludedDirectories.filter((dir) => dir == 'node_modules' || dir == 'dist').length < 2){
                files.push(new File(this.nonoFiles[index]));
            }
        }else{
            console.error(`ERROR: Directory ${folder} does not exist.`);
        } 
    }
}