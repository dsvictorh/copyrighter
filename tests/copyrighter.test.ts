import { MockConsoleQuestion } from '../console-question/mock.console-question';
import { css, dockerfile, html, MockFiler, scss, js, ts, sh1, sh2 } from '../filer/mock.filer';
import { IConsoleQuestion } from '../interfaces/iconsole-question';
import { Program } from '../program';
import { IFiler } from '../interfaces/ifiler';
import * as fs  from 'fs';
import { Config } from '../models/config';
import * as path from 'path';

const filer: IFiler = new MockFiler();
const excludeQuestion: IConsoleQuestion = new MockConsoleQuestion(true);
const program = new Program(filer, excludeQuestion);
const year = new Date().getFullYear();

const excludeQuestionNo: IConsoleQuestion = new MockConsoleQuestion(false);
const programNo = new Program(filer, excludeQuestionNo);

const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../copyrighter.json')).toString());
config.copyright = config.copyright.replace('{year}', year);

const overrideConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../copyrighter.test.json')).toString());
overrideConfig.copyright = overrideConfig.copyright.replace('{year}', year);

const htmlConverted = `<!--\n${config.copyright}\n-->\n${html.replace(new RegExp(`<!--\\n${config.regex.replace('{year}', '[0-9]+')}\\n-->\\n`, 'gm'), '')}`;
const htmlOverrideConverted = `<!--\n${overrideConfig.copyright}\n-->\n${html}`;
const htmlRemoved = `${html.replace(new RegExp(`<!--\\n${config.regex.replace('{year}', '[0-9]+')}\\n-->\\n`, 'gm'), '')}`;

const cssConverted = `/*\n${config.copyright}\n*/\n${css}`;
const cssOverrideConverted = `/*\n${overrideConfig.copyright}\n*/\n${css}`;

const scssConverted = `/*\n${config.copyright}\n*/\n${scss}`;

const dockerfileConverted = `# ${config.copyright.replace(/\n/gm, '\n# ')}\n${dockerfile.replace(new RegExp(`# ${config.regex.replace('{year}', '[0-9]+').replace(/\\n/gm, '\\n# ')}\\n`, 'gm'), '')}`;

const jsConverted = `/*\n${config.copyright}\n*/\n${js.replace(new RegExp(`\\/\\*\\n${config.regex.replace('{year}', '[0-9]+')}\\n\\*\\/\\n`, 'gm'), '')}`;

const tsConverted = `#!/usr/bin/env node\n/*\n${config.copyright}\n*/\n${ts.replace(`#!/usr/bin/env node\n`, '')}`;

const sh1Converted = `#!/bin/sh -e\n# ${config.copyright.replace(/\n/gm, '\n# ')}\n${sh1.replace(`#!/bin/sh -e\n`, '')}`;

const sh2Converted = `#!/usr/bin/env bash\n# ${config.copyright.replace(/\n/gm, '\n# ')}\n${sh2.replace(`#!/usr/bin/env bash\n`, '')}`;

describe('Test Copyrighter Works', () => {
    test('Copyrights All Files', async () => {
        const files = await program.run({ folder: './', fileTypes: [], excludedFolders: ['node_modules', 'dist'], year: year, config: new Config(config), tommy: false});
        const filerObj = filer as MockFiler;

        expect(files.length).toEqual(filerObj.files.concat(filerObj.innerFiles).length);
    });

    test('Copyrights HTML, CSS, SCSS Fails', async () => {
        let error;

        try{
            await program.run({ folder: './', fileTypes: ['html', 'css', 'scss', 'fail'], excludedFolders: ['node_modules', 'dist'], year: year, config: new Config(config), tommy: false}); 
        }catch(ex){
            error = ex;
        }
        
        expect(error).not.toBe(undefined);
        expect(error.code).toBe(1);
        expect(error.message).toBe('FAILED: 1/7 files failed to be processed.');
    });

    test('Copyrights HTML, CSS, SCSS', async () => {
        const files = await program.run({ folder: './', fileTypes: ['html', 'css', 'scss'], excludedFolders: ['node_modules', 'dist'], year: year, config: new Config(config)});

        expect(files.length).toEqual(6);
        expect(files[0].data).toEqual(htmlConverted);
        expect(files[1].data).toEqual(htmlConverted);
        expect(files[2].data).toEqual(cssConverted);
        expect(files[3].data).toEqual(cssConverted);
        expect(files[4].data).toEqual(scssConverted);
        expect(files[5].data).toEqual(scssConverted);
    });

    test('Copyrights Dockerfile', async () => {
        const files = await program.run({ folder: './', fileTypes: ['dockerfile'], excludedFolders: ['node_modules', 'dist'], year: year, config: new Config(config)});
       
        expect(files.length).toEqual(2);
        expect(files[0].data).toEqual(dockerfileConverted);
        expect(files[1].data).toEqual(dockerfileConverted);
    });

    test.only('Copyrights Bash', async () => {
        const files = await program.run({ folder: './', fileTypes: ['sh'], excludedFolders: ['node_modules', 'dist'], year: year, config: new Config(config)});
       
        console.warn(files[1].data);
        console.warn(sh1Converted);
        console.warn(files[2].data);
        console.warn(sh2Converted);
        expect(files.length).toEqual(4);
        expect(files[0].data).toEqual(sh1Converted);
        expect(files[1].data).toEqual(sh1Converted);
        expect(files[2].data).toEqual(sh2Converted);
        expect(files[3].data).toEqual(sh2Converted);
    });

    test('Copyrights JS, TS', async () => {
        const files = await program.run({ folder: './', fileTypes: ['js', 'ts'], excludedFolders: ['node_modules', 'dist'], year: year, config: new Config(config)});
        
        expect(files.length).toEqual(4);
        expect(files[0].data).toEqual(jsConverted);
        expect(files[1].data).toEqual(jsConverted);
        expect(files[2].data).toEqual(tsConverted);
        expect(files[3].data).toEqual(tsConverted);
    });
});

describe('Test Copyrighter Removes', () => {
    test('Copyrights All Files', async () => {
        const files = await program.run({ folder: './', fileTypes: [], excludedFolders: ['node_modules', 'dist'], year: year, config: new Config(config), tommy: false});
        const filerObj = filer as MockFiler;

        expect(files.length).toEqual(filerObj.files.concat(filerObj.innerFiles).length);
    });

    test('Removes HTML,CSS', async () => {
        const files = await program.run({ folder: './', fileTypes: ['html', 'css'], excludedFolders: ['node_modules', 'dist'], year: year, config: new Config(config), remove: true});
        
        expect(files.length).toEqual(4); 
        expect(files[0].data).toEqual(htmlRemoved);
        expect(files[1].data).toEqual(htmlRemoved);
        expect(files[2].data).toEqual(css);
        expect(files[3].data).toEqual(css);
    });
});

describe('Test Warning Works', () => {
    test('Confirmed Operation Missing Dist', async () => {
        const files = await program.run({ folder: './', fileTypes: [], excludedFolders: ['node_modules'], year: year, config: new Config(config)});
        const filerObj = filer as MockFiler;

        expect(files.length).toEqual(filerObj.files.concat(filerObj.innerFiles).concat(filerObj.nonoFiles).length);
    });

    test('Cancelled Operation Missing Node Modules', async () => {
        const files = await programNo.run({ folder: './', fileTypes: [], excludedFolders: ['dist'], year: year, config: new Config(config)});
        
        expect(files.length).toEqual(0);
    });
});

describe('Test Folder Options Works', () => {
    test('Copyrights Excluding Inner Files', async () => {
        const files = await program.run({ folder: './', fileTypes: [], excludedFolders: ['node_modules', 'dist', 'inner-test'], year: year, config: new Config(config)});
        const filerObj = filer as MockFiler;
        
        expect(files.length).toEqual(filerObj.files.length);
    });

    test('Fails Folder Does Not Exist', async () => {
        const files = await programNo.run({ folder: './test', fileTypes: [], excludedFolders: ['node_modules', 'dist'], year: year, config: new Config(config)});
        
        expect(files.length).toEqual(0);
    });
});

describe('Test Override Config Works', () => {
    test('Copyrights With New Config Old HTML Copyright Stays', async () => {
        const files = await program.run({ folder: './', fileTypes: [], excludedFolders: ['node_modules', 'dist'], year: year, config: new Config(Object.assign(JSON.parse(JSON.stringify(config)), overrideConfig))});
        
        expect(files.length).toEqual(4);
        expect(files[0].data).toEqual(htmlOverrideConverted);
        expect(files[1].data).toEqual(htmlOverrideConverted);
        expect(files[2].data).toEqual(cssOverrideConverted);
        expect(files[3].data).toEqual(cssOverrideConverted);
    });

    test('Copyrights With New Config Ignores JS', async () => {
        const files = await program.run({ folder: './', fileTypes: ['html', 'css', 'js'], excludedFolders: ['node_modules', 'dist'], year: year, config: new Config(Object.assign(JSON.parse(JSON.stringify(config)), overrideConfig))});
        
        expect(files.length).toEqual(4);
        expect(files[0].data).toEqual(htmlOverrideConverted);
        expect(files[1].data).toEqual(htmlOverrideConverted);
        expect(files[2].data).toEqual(cssOverrideConverted);
        expect(files[3].data).toEqual(cssOverrideConverted);
    });
});

describe('Test Copyrighter Scan Works', () => {
    test('Scans All Files', async () => {
        let error;
        const filerObj = filer as MockFiler;
        const nonCopyrightedFiles = filerObj.files.filter((item) => !item.data.includes('Copyright (c)')).concat(filerObj.innerFiles.filter((item) => !item.data.includes('Copyright (c)'))).length

        try{
            await program.run({ folder: './', fileTypes: [], excludedFolders: ['node_modules', 'dist'], scan: true, config: new Config(config)})
        }catch(ex){
            error = ex;
        }

        expect(error).not.toBe(undefined);
        expect(error.code).toBe(1);
        expect(error.message).toBe(`FAILED: ${nonCopyrightedFiles} files missing copyright text.`);
    });

    test('Scans All Files With year 2019', async () => {
        let error;
        const filerObj = filer as MockFiler;
        const nonCopyrightedFiles = filerObj.files.filter((item) => !item.data.includes('Copyright (c) 2019')).concat(filerObj.innerFiles.filter((item) => !item.data.includes('Copyright (c) 2019'))).length

        try{
            await program.run({ folder: './', fileTypes: [], excludedFolders: ['node_modules', 'dist'], year: 2019, scan: true, config: new Config(config)})
        }catch(ex){
            error = ex;
        }

        console.error(error.message, nonCopyrightedFiles);
        expect(error).not.toBe(undefined);
        expect(error.code).toBe(1);
        expect(error.message).toBe(`FAILED: ${nonCopyrightedFiles} files missing copyright text with the year 2019.`);
    });

    

    test('Scans All Files Log Mode', async () => {
        let error;

        try{
            await program.run({ folder: './', fileTypes: [], excludedFolders: ['node_modules', 'dist'], logMode: true, scan: true, year: 2019, config: new Config(config)})
        }catch(ex){
            error = ex;
        }

        expect(error).toBe(undefined);
    });

    test('Scans HTML, CSS Ignores JS', async () => {   
        let error;

        try{
           await program.run({ folder: './', fileTypes: ['html', 'css', 'js'], excludedFolders: ['node_modules', 'dist'], scan: true, year: year, config: new Config(Object.assign(JSON.parse(JSON.stringify(config)), overrideConfig))});
        }catch(ex){
            error = ex;
        }   

        expect(error).not.toBe(undefined);
        expect(error.code).toBe(1);
        expect(error.message).toBe(`FAILED: 4 files missing copyright text with the year ${year}.`);
    });
});