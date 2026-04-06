type Operation = "=" | "!=" | ">" | "<" | "be empty" | "not be empty";

interface Filter {
    fieldName: string;
    operation: Operation;
    value: string | number;
}

enum RetrievalType {
    GET_FIELD, GET_NUM_RECORDS
}


class AssertionBuilder {
    table: string;
    filters: Filter[];
    retrievalType?: RetrievalType;
    fieldToRetrieve?: string;
    assertionOperation?: Operation;
    assertionValue?: string | number;

    constructor(table: string) {
        this.table = table;
        this.filters = [];
    }


    getField(fieldName: string) {
        this.retrievalType = RetrievalType.GET_FIELD;
        this.fieldToRetrieve = fieldName;
        return new Assertable(this);
    }
    getNumberOfRecords() {
        this.retrievalType = RetrievalType.GET_NUM_RECORDS;
        return new Assertable(this);
    }

    where(fieldName: string, operation: Operation, value: string | number) {
        this.filters.push({
            fieldName,
            operation,
            value
        });
        return this;
    }

}


export const printAssertion = (assertion: AssertionBuilder) => {
    let filterString;
    if (assertion.filters.length > 0) {
        filterString = <> where {assertion.filters.map((filter, i) => {
            return (
                <span key={i}>
                    {i > 0 ? (<span className="assertion__filter-AND"> AND </span>) : null}<span className="assertion__filter-fieldName">{filter.fieldName}</span> <span className="assertion__filter-operation">{filter.operation}</span> <span className="assertion__filter-value">{filter.value}</span>
                </span>
            );
        })}, </>
    } else {
        filterString = "";
    }
    if (assertion.retrievalType === RetrievalType.GET_FIELD) {
        return (
            <>
                In the table <span className="assertion-table-name">{assertion.table}</span>, for all entries {filterString} the field <span className="assert-field-name">{assertion.fieldToRetrieve}</span> should <span className="assert-operation">{assertion.assertionOperation}</span> <span className="assert-value">{assertion.assertionValue}</span>
            </>
        )
    }
    if (assertion.retrievalType === RetrievalType.GET_NUM_RECORDS) {

        return (
            <>
                In the table <span className="assertion-table-name">{assertion.table}</span>, {filterString} the number of records should <span className="assert-operation">{assertion.assertionOperation}</span> <span className="assert-value">{assertion.assertionValue}</span>
            </>
        )
    }
}

class Result {
    data: AssertionBuilder;
    constructor(data: AssertionBuilder) {
        this.data = data;
    }
}

class Assertable extends Result {
    addAssertion() {
        if (Storm.tests.length > 0) {
            const currTest = Storm.tests[Storm.tests.length - 1];
            currTest.assertions.push(this.data);
        }
    }
    shouldEqual(value: number | string) {
        this.data.assertionOperation = "=";
        this.data.assertionValue = value;
        this.addAssertion();
    }
    shouldNotEqual(value: number | string) {
        this.data.assertionOperation = "!=";
        this.data.assertionValue = value;
        this.addAssertion();
    }
    shouldBeGreaterThan(value: number) {
        this.data.assertionOperation = ">";
        this.data.assertionValue = value;
        this.addAssertion();
    }
    shouldBeLessThan(value: number) {
        this.data.assertionOperation = "<";
        this.data.assertionValue = value;
        this.addAssertion();
    }
    shouldBeEmpty() {
        this.data.assertionOperation = "be empty";
        this.addAssertion();
    }
    shouldNotBeEmpty() {
        this.data.assertionOperation = "not be empty";
        this.addAssertion();
    }
}

class SnowTest {
    desc: string;
    assertions: AssertionBuilder[];
    constructor(desc: string) {
        this.desc = desc;
        this.assertions = [];
    }
}

class SnowStorm {
    tests: SnowTest[];
    constructor() {
        this.tests = [];
    }
}

export const Storm = new SnowStorm();

export const addTest = (description: string, testFunction: () => void) => {
    Storm.tests.push(new SnowTest(description));
    testFunction();
}

export const inTable = (tableName: string) => {
    return new AssertionBuilder(tableName);
}