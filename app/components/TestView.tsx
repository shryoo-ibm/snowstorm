import { Assertion, Storm, filtersToQuery, AssertionSubjectType, operationToNaturalMap, Operation, SnowTest } from "../model/Storm";
import { AssertionResult } from "../model/AssertionResult";
import { useState } from "react";


export const printAssertion = (assertion: Assertion) => {
    // const query = filtersToQuery(assertion.filters);
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
    if (assertion.assertionSubjectType === AssertionSubjectType.GET_FIELD) {
        return (
            <>
                <span>
                    In the table <span className="assertion-table-name">{assertion.table}</span>, for all entries {filterString} the field <span className="assert-field-name">{assertion.assertionSubject}</span> should <span className="assert-operation">{operationToNaturalMap[assertion.assertionOperation as Operation]}</span> <span className="assert-value">{assertion.assertionPredicate}</span>
                </span>
            </>
        )
    }
    if (assertion.assertionSubjectType === AssertionSubjectType.GET_NUM_RECORDS) {

        return (
            <>
                <span>
                    In the table <span className="assertion-table-name">{assertion.table}</span>, {filterString} the number of records should <span className="assert-operation">{operationToNaturalMap[assertion.assertionOperation as Operation]}</span> <span className="assert-value">{assertion.assertionPredicate}</span>

                </span>
            </>
        )
    }
}

const SingleAssertion = ({ assertion, testNum, assertionNum, setSelectedResults }: { assertion: Assertion, testNum: number, assertionNum: number, setSelectedResults: (result: null | AssertionResult) => void }) => {
    const [results, setResults] = useState<AssertionResult | null>(null);
    const [expanded, setExpanded] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const runOnClick = async () => {
        setLoading(true);
        const results = await assertion.evaluate();
        setResults(results);
        setExpanded(true);
        setLoading(false);
    }
    return (
        <>
            <div className="heading-wrap">

                <h3 id={`accordion-${testNum}-${assertionNum}`} className={`accordion-list-item__heading ${expanded ? "expanded" : "collapsed"}`}>
                    {printAssertion(assertion)}
                </h3>

                <div className="button-wrap">

                    {loading ? "Loading" : <button onClick={runOnClick} className="accordion-list-item__button accordion-list-item__run-button">
                        Run
                    </button>}


                    <button type="button" aria-expanded={expanded} aria-controls={`section-${testNum}-${assertionNum}`} onClick={() => setExpanded(!expanded)} className="accordion-list-item__button">
                        Show results
                    </button>


                </div>

            </div>

            <section className="accordion-list-item__expandable-section" aria-labelledby={`accordion-${testNum}-${assertionNum}`} style={{ display: expanded ? "block" : "none" }}>
                <h4>Results</h4>
                <p>{results?.passed ? "PASSED" : "FAILED"}</p>
                <p>{results?.milliseconds ? "Duration: " + results.milliseconds + "ms" : null}</p>
            </section>
        </>
    )
}

const SingleTest = ({ test, testNum, setSelectedResults }: { test: SnowTest, testNum: number, setSelectedResults: (result: null | AssertionResult) => void }) => {
    const [expanded, setExpanded] = useState<boolean>(true);
    return (
        <li className="accordion-list-item">

            <div className="heading-wrap">

                <h2 id={`accordion-${testNum}`} className={`accordion-list-item__heading ${expanded ? "expanded" : "collapsed"}`}>
                    {test.desc}
                </h2>

                <div className="button-wrap">


                    <button onClick={() => {
                        test.runAll();
                    }} className="accordion-list-item__button accordion-list-item__run-button">
                        Run all
                    </button>


                    <button type="button" aria-expanded={expanded} aria-controls={`section-${testNum}`} onClick={() => setExpanded(!expanded)} className="accordion-list-item__button">
                        Expand
                    </button>
                </div>

            </div>

            <section aria-labelledby={`accordion-${testNum}`} style={{ display: expanded ? "block" : "none" }} className="accordion-list-item__expandable-section">
                <ol>
                    {test.assertions.map((assertion, assertionNum) => {
                        return (
                            <li key={`test${testNum}-assertion${assertionNum}`} className="accordion-list-item">
                                <SingleAssertion assertion={assertion} testNum={testNum} assertionNum={assertionNum} setSelectedResults={setSelectedResults} />
                            </li>
                        )
                    })}
                </ol>
            </section>
        </li>
    );
};

export const TestView = ({ setSelectedResults }: { setSelectedResults: (result: null | AssertionResult) => void }) => {
    return (
        <ol>
            {Storm.tests.map((test, testNum) => {
                return (
                    <SingleTest key={testNum} test={test} testNum={testNum} setSelectedResults={setSelectedResults} />
                );
            })}
        </ol>
    );
}