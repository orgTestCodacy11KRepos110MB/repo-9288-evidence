import { test } from 'uvu';
import * as assert from 'uvu/assert';
import runQuery from '../index.cjs';

let results;

//run command => MYSQL_HOST=127.0.0.1 MYSQL_USER=username MYSQL_PASSWORD=password MYSQL_DATABASE=test npm test
test('query runs', async () => {
    try{
        results = await runQuery("select 100 as number_col, CURDATE() as date_col, current_timestamp as timestamp_col, 'Evidence' as string_col, false as bool_col");
        console.log(`Results ${JSON.stringify(results, null, 2)}`);
        assert.instance(results.rows, Array);
        assert.instance(results.columnTypes, Array);
        assert.type(results.rows[0], "object");
        assert.equal(results.rows[0].number_col, 100);

        let actualColumnTypes = results.columnTypes.map(columnType => columnType.evidenceType);
        let actualColumnNames = results.columnTypes.map(columnType => columnType.name);
        let actualTypePrecisions = results.columnTypes.map(columnType => columnType.typeFidelity);

        let expectedColumnTypes = ['number', 'date', 'date', 'string', 'number']; //Note MySQL booleans are LONGLONG (1, 0) ?
        let expectedColumnNames = ['number_col', 'date_col', 'timestamp_col', 'string_col', 'bool_col'];
        let expectedTypePrecision = Array(5).fill('precise');

        assert.equal(true, (expectedColumnTypes.length === actualColumnTypes.length && expectedColumnTypes.every((value, index) => value === actualColumnTypes[index])));
        assert.equal(true, (expectedColumnNames.length === actualColumnNames.length && expectedColumnNames.every((value, index) => value === actualColumnNames[index])));
        assert.equal(true, (expectedTypePrecision.length === actualTypePrecisions.length && expectedTypePrecision.every((value, index) => value === actualTypePrecisions[index])));
    } catch(e) {
        throw Error(e)
    }
})

test.run();