const fs = require('fs');
const glob = require('glob');
const { compileFromFile } = require('json-schema-to-typescript');

glob('node_modules/mparticle_json_validation/**/*.json', {}, (err, schemas) => {
    schemas.forEach((schema) => {
        const interfaceName = schema.replace(/^.*[\\\/]/, '').replace('.json', '.interface.ts').replace(/_/g, '-');

        compileFromFile(schema).then(ts => fs.writeFileSync(`src/app/core/analytics/events-interfaces/${interfaceName}`, ts));
    });
});
