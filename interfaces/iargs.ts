import { Config } from '../models/config';

export interface IArgs{
    folder: string;
    fileTypes: string[];
    excludedFolders: string[];
    config: Config;
    remove?: boolean;
    tommy?: boolean;
}