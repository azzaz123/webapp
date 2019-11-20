const fs = require('fs');
const glob = require('glob');
const { compileFromFile } = require('json-schema-to-typescript');

const jsonSchemasLocationPattern = 'node_modules/mparticle_json_validation/**/*.json';
const screenIdsFileLocation = 'node_modules/mparticle_json_validation/screen_ids.txt';

const eventNames = [];
const analyticsPath = 'src/app/core/analytics';

const createInterfaceFilesFromJSONsSchemaPath = jsonPath => {
    try {
        // Generate interface file name from json path
        const interfaceFileName = jsonPath.replace(/^.*[\\\/]/, '').replace('.json', '.interface.ts').replace(/_/g, '-');

        // Parse content as a Javascript object and store event title for later use
        const rawFile = fs.readFileSync(jsonPath);
        const interfaceObj = JSON.parse(rawFile);
        eventNames.push(interfaceObj.title);

        // Save interface to file
        compileFromFile(jsonPath).then(ts => fs.writeFileSync(`${analyticsPath}/events-interfaces/${interfaceFileName}`, ts));
    } catch (error) {
        console.warn(`The file ${schema} could not be parsed to a valid interface`, error);
    }
};

const createEventNamesEnumFile = () => {
    let eventNamesEnum = 'export enum ANALYTICS_EVENT_NAMES {\n';
    eventNames.forEach(eventName => {
        eventNamesEnum += `\n\t${eventName.replace(/ /g, '')} = '${eventName}',`;
    });
    eventNamesEnum += '}\n\n';

    fs.writeFileSync(`${analyticsPath}/resources/analytics-event-names.ts`, eventNamesEnum);
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
    
        fs.writeFileSync(`${analyticsPath}/resources/analytics-screen-ids.ts`, screenIdEnum);
    } catch (error) {
        console.warn('Could not parse screen ids', error);
    }
};

const main = () => {
    // Read all JSON files from mparticle JSON schemas, create interfaces and event names enum when done
    glob(jsonSchemasLocationPattern, {}, (err, schemas) => {
        schemas.forEach(path => createInterfaceFilesFromJSONsSchemaPath(path));
        createEventNamesEnumFile();    
    });

    // Read screen ids txt file and generate screen ids enum
    createScreenIdsInterface();
}

main();
