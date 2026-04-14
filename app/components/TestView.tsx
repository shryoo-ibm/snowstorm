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
                <p>
                    In the table <span className="assertion-table-name">{assertion.table}</span>, for all entries {filterString} the field <span className="assert-field-name">{assertion.assertionSubject}</span> should <span className="assert-operation">{operationToNaturalMap[assertion.assertionOperation as Operation]}</span> <span className="assert-value">{assertion.assertionPredicate}</span>
                </p>
            </>
        )
    }
    if (assertion.assertionSubjectType === AssertionSubjectType.GET_NUM_RECORDS) {

        return (
            <>
                <p>
                    In the table <span className="assertion-table-name">{assertion.table}</span>, {filterString} the number of records should <span className="assert-operation">{operationToNaturalMap[assertion.assertionOperation as Operation]}</span> <span className="assert-value">{assertion.assertionPredicate}</span>

                </p>
            </>
        )
    }
}

const SingleAssertion = ({ assertion, i, j, setSelectedResults }: { assertion: Assertion, i: number, j: number, setSelectedResults: (result: null | AssertionResult) => void }) => {
    const [results, setResults] = useState<AssertionResult | null>(null);
    const [expanded, setExpanded] = useState<boolean>(false);
    const runOnClick = async () => {
        const results = await assertion.evaluate();
        setResults(results);
    }
    return (
        <>
            <div className="heading-wrap">

                <h3 id={`accordion-${i}-${j}`} className={`accordion-list-item__heading ${expanded ? "expanded" : "collapsed"}`}>
                    {printAssertion(assertion)}
                </h3>

                <div className="button-wrap">


                    <button onClick={runOnClick} className="accordion-list-item__button accordion-list-item__run-button">
                        Run
                    </button>

                    <button type="button" aria-expanded={expanded} aria-controls={`section-${i}-${j}`} onClick={() => setExpanded(!expanded)} className="accordion-list-item__button">
                        Expand
                    </button>


                </div>

            </div>

            <section className="accordion-list-item__expandable-section" aria-labelledby={`accordion-${i}-${j}`} style={{ display: expanded ? "block" : "none" }}>
                <h4>Results</h4>
            </section>
        </>
    )
}

const SingleTest = ({ test, i, setSelectedResults }: { test: SnowTest, i: number, setSelectedResults: (result: null | AssertionResult) => void }) => {
    const [expanded, setExpanded] = useState<boolean>(true);
    return (
        <li className="accordion-list-item">

            <div className="heading-wrap">

                <h2 id={`accordion-${i}`} className={`accordion-list-item__heading ${expanded ? "expanded" : "collapsed"}`}>
                    {test.desc}
                </h2>

                <div className="button-wrap">


                    <button onClick={() => {
                        test.runAll();
                    }} className="accordion-list-item__button accordion-list-item__run-button">
                        Run all
                    </button>


                    <button type="button" aria-expanded={expanded} aria-controls={`section-${i}`} onClick={() => setExpanded(!expanded)} className="accordion-list-item__button">
                        Expand
                    </button>
                </div>

            </div>

            <section aria-labelledby={`accordion-${i}`} style={{ display: expanded ? "block" : "none" }} className="accordion-list-item__expandable-section">
                <ol>
                    {test.assertions.map((assertion, j) => {
                        return (
                            <li key={`test${i}-assertion${j}`} className="accordion-list-item">
                                <SingleAssertion assertion={assertion} i={i} j={j} setSelectedResults={setSelectedResults} />
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
            {Storm.tests.map((test, i) => {
                return (
                    <SingleTest test={test} i={i} key={i} setSelectedResults={setSelectedResults} />
                );
            })}
        </ol>
    );
}