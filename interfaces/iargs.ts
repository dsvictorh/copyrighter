import { Config } from '../models/config';

export interface IArgs{
    folder: string;
    fileTypes: string[];
    excludedFolders: string[];
    config: Config;
    year?: number;
    logMode?: boolean;
    remove?: boolean;
    scan?: boolean;
    tommy?: boolean;
}