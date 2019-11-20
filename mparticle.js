const fs = require('fs');
const glob = require('glob');
const { compileFromFile } = require('json-schema-to-typescript');

const jsonSchemasLocationPattern = 'node_modules/mparticle_json_validation/**/*.json';
const screenIdsFileLocation = 'node_modules/mparticle_json_validation/screen_ids.txt';

const eventNames = [];
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

        // Save interface to file
        compileFromFile(jsonPath).then(ts => fs.writeFileSync(`${eventInterfacesFolderPath}${interfaceFileName}`, ts));
    } catch (error) {
        console.warn(`The file ${schema} could not be parsed to a valid interface`, error);
    }
};

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
        screenIdEnum += '}';
    
        fs.writeFileSync(`${analyticsFolderPath}analytics-screen-ids.ts`, screenIdEnum);
    } catch (error) {
        console.warn('Could not parse screen ids', error);
    }
};

const checkFolders = () => {
    if (!fs.existsSync(analyticsFolderPath)){
        fs.mkdirSync(analyticsFolderPath);
    }

    if (!fs.existsSync(eventInterfacesFolderPath)){
        fs.mkdirSync(eventInterfacesFolderPath);
    }
}

const main = () => {
    // Ensure that folders exist
    checkFolders();

    // Read all JSON files from mparticle JSON schemas, create interfaces and event names enum when done
    glob(jsonSchemasLocationPattern, {}, (err, schemas) => {
        schemas.forEach(path => createInterfaceFileFromJSONsSchemaPath(path));
        createEventNamesEnumFile();    
    });

    // Read screen ids txt file and generate screen ids enum
    createScreenIdsInterface();
}

main();
