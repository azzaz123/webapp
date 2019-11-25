const fs = require('fs');
const glob = require('glob');
const Path = require('path');
const { compileFromFile } = require('json-schema-to-typescript');

const jsonSchemasLocationPattern = 'node_modules/mparticle_json_validation/**/*.json';
const screenIdsFileLocation = 'node_modules/mparticle_json_validation/screen_ids.txt';

const eventNames = [];
const interfacesFileNames = [];
const analyticsFolderPath = 'src/app/core/analytics/resources/';
const eventInterfacesFolderPath = `${analyticsFolderPath}events-interfaces/`

const createInterfaceFileFromJSONsSchemaPath = jsonPath => {
    try {
        // Generate interface file name from json path
        const interfaceFileName = jsonPath.replace(/^.*[\\\/]/, '').replace('.json', '.interface.ts').replace(/_/g, '-');

        // Parse content as a Javascript object and store event title for later use
        const rawFile = fs.readFileSync(jsonPath);
        const interfaceObj = JSON.parse(rawFile);
        eventNames.push(interfaceObj.title);

        // Store interface file name to generate index.ts
        interfacesFileNames.push(interfaceFileName);

        // Save interface to file
        compileFromFile(jsonPath).then(ts => fs.writeFileSync(`${eventInterfacesFolderPath}${interfaceFileName}`, ts));
    } catch (error) {
        console.warn(`The file ${schema} could not be parsed to a valid interface`, error);
    }
};

const createInterfacesIndexFile = () => {
    let indexFileContent = '';
    interfacesFileNames.forEach(interfaceFileName => {
        indexFileContent += `export * from './${interfaceFileName.replace('.ts', '')}';\n`
    });
    fs.writeFileSync(`${eventInterfacesFolderPath}index.ts`, indexFileContent);
}

const createEventNamesEnumFile = () => {
    let eventNamesEnum = 'export enum ANALYTICS_EVENT_NAMES {\n';
    eventNames.forEach(eventName => {
        eventNamesEnum += `\t${eventName.replace(/ /g, '')} = '${eventName}',\n`;
    });
    eventNamesEnum += '}\n\n';

    fs.writeFileSync(`${analyticsFolderPath}analytics-event-names.ts`, eventNamesEnum);
};

const createScreenIdsInterface = () => {
    try {
        const lines = fs.readFileSync(screenIdsFileLocation, 'utf-8').split('\n');
        
        let screenIdEnum = 'export enum SCREEN_IDS {\n';
        lines.forEach(line => {
            const split = line.replace(/ /g, '').split(':');
            const screenName = split[0];
            const screenNumber = split[1];

            if (screenName && screenNumber) {
                screenIdEnum += `\t${screenName} = ${screenNumber},\n`;
            }
        })
        screenIdEnum += '}\n';
    
        fs.writeFileSync(`${analyticsFolderPath}analytics-screen-ids.ts`, screenIdEnum);
    } catch (error) {
        console.warn('Could not parse screen ids', error);
    }
};

const cleanFolders = () => {
    // This function clears all files inside a folder path if it exists
    const cleanDirectory = path => {
        if (!fs.existsSync(path)) {
            return;
        }

        fs.readdirSync(path).forEach(file => {
            const curPath = Path.join(path, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                cleanDirectory(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
    };

    // If the folders don't exists, create them and if they already exists, remove all files inside
    if (!fs.existsSync(analyticsFolderPath)) {
        fs.mkdirSync(analyticsFolderPath);
    } else {
        cleanDirectory(analyticsFolderPath);
    }

    if (!fs.existsSync(eventInterfacesFolderPath)) {
        fs.mkdirSync(eventInterfacesFolderPath);
    } else {
        cleanDirectory(eventInterfacesFolderPath);
    }
}

const main = () => {
    // Clear all previously generated files
    cleanFolders();

    // Read all JSON files from mparticle JSON schemas, create interfaces, index and event names enum
    glob(jsonSchemasLocationPattern, {}, (err, schemas) => {
        schemas.forEach(path => createInterfaceFileFromJSONsSchemaPath(path));
        createInterfacesIndexFile();
        createEventNamesEnumFile();    
    });

    // Read screen ids txt file and generate screen ids enum
    createScreenIdsInterface();
}

main();
