import { File } from '../models/file';
import { IFiler } from '../interfaces/ifiler';


export const html = `<!--
Copyright (c) 2020 Corporation, Inc.

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

export const dockerfile = `# Copyright (c) 2019 Corporation, Inc.
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
Copyright (c) 2019 Corporation, Inc.

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

export const sh1 = `#!/bin/sh -e

for (( counter=10; counter>0; counter-- ))
do
echo -n "$counter "
done
printf`;

export const sh2 = `#!/usr/bin/env bash

for (( counter=10; counter>0; counter-- ))
do
echo -n "$counter "
done
printf`;

export const fail = 'fail';


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
            new File({ name: 'test.ts', path: './test', data: ts}),
            new File({ name: 'test1.sh', path: './test', data: sh1}),
            new File({ name: 'test2.sh', path: './test', data: sh2})
        ];
        
        this.innerFiles = [
            new File({ name: 'inner-test.html', path: './inner-test',  data: html}),
            new File({ name: 'inner-test.css', path: './inner-test', data: css}),
            new File({ name: 'inner-test.scss', path: './inner-test', data: scss}),
            new File({ name: 'inner.dockerfile', path: './inner-test', data: dockerfile}),
            new File({ name: 'inner-test.js', path: './inner-test', data: js}),
            new File({ name: 'inner-test.ts', path: './inner-test', data: ts}),
            new File({ name: 'inner-test1.sh', path: './inner-test', data: sh1}),
            new File({ name: 'inner-test2.sh', path: './inner-test', data: sh2})
        ];

        this.nonoFiles = [
            new File({ name: 'nono.html', path: './nono',  data: html}),
            new File({ name: 'nono.css', path: './nono', data: css}),
            new File({ name: 'nono.scss', path: './nono', data: scss}),
            new File({ name: 'nono.dockerfile', path: './nono', data: dockerfile}),
            new File({ name: 'nono.js', path: './nono', data: js}),
            new File({ name: 'nono.ts', path: './nono', data: ts}),
            new File({ name: 'nono1.sh', path: './nono', data: sh1}),
            new File({ name: 'nono2.sh', path: './nono', data: sh2})
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
                case 'sh':
                    this.addFiles(folder, excludedDirectories, files, 6);
                    this.addFiles(folder, excludedDirectories, files, 7);
                    break;
                case 'fail':
                    files.push(new File({ name: 'fail.html', path: './fail',  data: fail}));
                    break;
            }
        }

        return files;
    }

    public replaceFile(file: File): void{
        if(file.data.endsWith('fail')){
            throw new Error('Cannot save file');
        }

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