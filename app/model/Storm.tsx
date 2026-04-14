import { fetchTable } from "../utils/fetch-snow";
import { AssertionResult } from "./AssertionResult";

export type Operation = "starts with" | "ends with" | "contains" | "does not contain" | "is" | "is not" | "is empty" | "is anything" | "is one of" | "is empty string" | "less than or equal to" | "greater than or equal to" | "between" | "is same" | "is different";

type StringOrNumber = string | number;

const operationToQueryMap: { [key in Operation]: string } = {
    "starts with": "STARTSWITH",
    "ends with": "ENDSWITH",
    "contains": "LIKE",
    "does not contain": "NOT LIKE",
    "is": "=",
    "is not": "!=",
    "is empty": "ISEMPTY",
    "is anything": "ANYTHING",
    "is one of": "IN",
    "is empty string": "EMPTYSTRING",
    "less than or equal to": "<=",
    "greater than or equal to": ">=",
    "between": "BETWEEN",
    "is same": "SAMEAS",
    "is different": "NSAMEAS"
}

export const operationToNaturalMap: { [key in Operation]: string } = {
    "starts with": "start with",
    "ends with": "end with",
    "contains": "contain",
    "does not contain": "not contain",
    "is": "be",
    "is not": "not be",
    "is empty": "be empty",
    "is anything": "not be empty",
    "is one of": "be one of",
    "is empty string": "be an empty string",
    "less than or equal to": "be less than or equal to",
    "greater than or equal to": "be greater than or equal to",
    "between": "be between",
    "is same": "be the same as",
    "is different": "be different from"
}

interface Filter {
    fieldName: string;
    operation: Operation;
    value?: StringOrNumber | StringOrNumber[];
    joiner?: "and" | "or";
}

//companyENDSWITH3^ORnameISNOTEMPTY
//companyLIKE5^ORnameISNOTEMPTY

export const filtersToQuery = (filters: Filter[]) => {
    let query = "";

    for (let i = 0; i < filters.length; i++) {
        const filter = filters[i];
        const queryOperation = operationToQueryMap[filter.operation];
        let values = "";

        if (Array.isArray(filter.value)) {
            if (filter.operation === "between" && filter.value[0] && filter.value[1]) {
                values += filter.value[0] + "@" + filter.value[1];
            }
            if (filter.operation === "is one of") {
                values += filter.value.join(",");
            }
        } else {
            values += filter.value;
        }
        if (i > 0) {
            query += filter.joiner === "or" ? "^OR" : "^";
        }
        query += filter.fieldName + queryOperation + values;
    }

    return query;
}

export enum AssertionSubjectType {
    GET_FIELD, GET_NUM_RECORDS
}


export class Assertion {
    table: string;
    filters: Filter[];
    assertionSubjectType?: AssertionSubjectType;
    assertionOperation: Operation;
    assertionPredicate?: StringOrNumber | StringOrNumber[];
    assertionSubject?: string;

    constructor(table: string) {
        this.table = table;
        this.filters = [];
        this.assertionOperation = "is";
    }


    getField(fieldName: string) {
        this.assertionSubjectType = AssertionSubjectType.GET_FIELD;
        this.assertionSubject = fieldName;
        return new Assertable(this);
    }
    getNumberOfRecords() {
        this.assertionSubjectType = AssertionSubjectType.GET_NUM_RECORDS;
        return new Assertable(this);
    }

    where(fieldName: string, operation: Operation, value?: StringOrNumber | StringOrNumber[]) {
        this.filters.push({
            fieldName,
            operation,
            value
        });
        return this;
    }


    async evaluate(): Promise<AssertionResult> {
        const data = await fetchTable(this.table, filtersToQuery(this.filters));
        const result = {
            passed: true,
            assertion: this,
            data: data
        };
        console.log(result);
        return result;
    }

}

export class Result {
    data: Assertion;
    constructor(data: Assertion) {
        this.data = data;
    }
}

export class Assertable extends Result {
    addAssertion() {
        if (Storm.tests.length > 0) {
            const currTest = Storm.tests[Storm.tests.length - 1];
            currTest.assertions.push(this.data);
        }
    }
    should(operation: Operation, value?: StringOrNumber | StringOrNumber[]) {
        this.data.assertionOperation = operation;
        this.data.assertionPredicate = value;
        this.addAssertion();
    }
    shouldEqual(value: StringOrNumber) {
        this.should("is", value);
    }
    shouldNotEqual(value: StringOrNumber) {
        this.should("is not", value);
    }
    shouldStartWith(value: string) {
        this.should("starts with", value);
    }
    shouldEndWith(value: string) {
        this.should("ends with", value);
    }
    shouldContain(value: string) {
        this.should("contains", value);
    }
    shouldNotContain(value: string) {
        this.should("does not contain", value);
    }
    shouldBeEmpty() {
        this.should("is empty");
    }
    shouldBeOneOf(values: StringOrNumber[]) {
        this.should("is one of", values);
    }
    shouldBeEmptyString() {
        this.should("is empty string");
    }
    shouldBeLessThanOrEqualTo(value: StringOrNumber) {
        this.should("less than or equal to", value);
    }
    shouldBeGreaterThanOrEqualTo(value: StringOrNumber) {
        this.should("greater than or equal to", value);
    }
    shouldBeBetween(value1: StringOrNumber, value2: StringOrNumber) {
        this.should("between", [value1, value2]);
    }
}

export class SnowTest {
    desc: string;
    assertions: Assertion[];
    constructor(desc: string) {
        this.desc = desc;
        this.assertions = [];
    }
    runAll() {
        for (const assertion of this.assertions) {
            assertion.evaluate();
        }
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
    return new Assertion(tableName);
}