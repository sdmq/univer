

export * from '../index';
declare module '@univer/sheets-plugin-filter' { }

// use css module
declare module '*.less' {
    const resource: { [key: string]: string };
    export = resource;
}
