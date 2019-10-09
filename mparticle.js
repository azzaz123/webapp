const fs = require('fs');
const glob = require('glob');
const { compileFromFile } = require('json-schema-to-typescript');
const eventNames = [];
const analyticsPath = 'src/app/core/analytics';

glob('node_modules/mparticle_json_validation/**/*.json', {}, (err, schemas) => {
    schemas.forEach((schema) => {
        const interfaceFileName = schema.replace(/^.*[\\\/]/, '').replace('.json', '.interface.ts').replace(/_/g, '-');
        const rawFile = fs.readFileSync(schema);
        const interfaceObj = JSON.parse(rawFile);

        eventNames.push(interfaceObj.title);

        compileFromFile(schema).then(ts => fs.writeFileSync(`${analyticsPath}/events-interfaces/${interfaceFileName}`, ts));
    });

    let eventNamesEnum = 'export enum ANALYTICS_EVENT_NAMES {\n';

    eventNames.forEach((eventName) => {
        eventNamesEnum += `\t${eventName.replace(/ /g, '')} = '${eventName}',\n`;
    });

    eventNamesEnum += '}';

    fs.writeFileSync(`${analyticsPath}/resources/analytics-event-names.ts`, eventNamesEnum);
});
