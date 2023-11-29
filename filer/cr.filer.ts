import * as fs from 'fs';
import { File } from '../models/file';
import * as path from 'path';
import { IFiler } from '../interfaces/ifiler';

export class CRFiler implements IFiler{
    public async getFiles(folder: string, fileTypes: string[], excludedDirectories: string[], encoding: BufferEncoding, files?: File[]): Promise<File[]>{
        files = files || [];
        for(let file of fs.readdirSync(folder, { encoding, withFileTypes: true})){
            const dots = file.name.split('.');
            let fileExtension = '';

            if(dots.length > 0){
                fileExtension = dots[dots.length - 1];
            }
            
            if(file.isFile() && fileTypes.indexOf(fileExtension.toLowerCase()) > -1){
                const dataPath = path.join(process.cwd(), folder);
                const data = fs.readFileSync(path.join(dataPath, file.name), encoding);
                files.push(new File({ name: file.name, path: dataPath, data }));
            }else if(file.isDirectory() && !excludedDirectories.some((dir) => dir == file.name)){
                await this.getFiles(path.join(folder, file.name), fileTypes, excludedDirectories, encoding, files);
            }
        }

        return files;
    }

    public replaceFile(file: File, encoding: BufferEncoding): void{
        fs.writeFileSync(path.join(file.path, file.name), file.data, encoding);
    }
}