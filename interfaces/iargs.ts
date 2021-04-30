import { Config } from '../models/config';

export interface IArgs{
    folder: string;
    fileTypes: string[];
    excludedFolders: string[];
    config: Config;
    remove?: boolean;
    scan?: boolean;
    tommy?: boolean;
}