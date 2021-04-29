import { File } from '../models/file';

export interface IFiler{
    getFiles(folder: string, fileTypes: string[], excludedDirectories: string[], enconding: BufferEncoding, files?: File[]): Promise<File[]>;
    replaceFile(file: File, encoding: BufferEncoding): void;
}