import { Assertion, Storm, filtersToQuery, AssertionSubjectType, operationToNaturalMap, Operation, SnowTest } from "../model/Storm";
import { AssertionResult } from "../model/AssertionResult";
import { useEffect, useEffectEvent, useState } from "react";
import React from "react";


export const printAssertion = (assertion: Assertion) => {
    // const query = filtersToQuery(assertion.filters);
    let filterString;
    if (assertion.filters.length > 0) {
        filterString = <> where {assertion.filters.map((filter, i) => {
            return (
                <React.Fragment key={i}>
                    {i > 0 ? (<span className="assertion__filter-AND"> AND </span>) : null}<span className="assertion__filter-fieldName">{filter.fieldName}</span> <span className="assertion__filter-operation">{filter.operation}</span> <span className="assertion__filter-value">{filter.value}</span>
                </React.Fragment>
            );
        })}, </>
    } else {
        filterString = "";
    }
    if (assertion.assertionSubjectType === AssertionSubjectType.GET_FIELD) {
        return (
            <>

                In the table <span className="assertion-table-name">{assertion.table}</span>, for all entries {filterString} the field <span className="assert-field-name">{assertion.assertionSubject}</span> should <span className="assert-operation">{operationToNaturalMap[assertion.assertionOperation as Operation]}</span> <span className="assert-value">{assertion.assertionPredicate}</span>

            </>
        )
    }
    if (assertion.assertionSubjectType === AssertionSubjectType.GET_NUM_RECORDS) {

        return (
            <>

                In the table <span className="assertion-table-name">{assertion.table}</span>, {filterString} the number of records should <span className="assert-operation">{operationToNaturalMap[assertion.assertionOperation as Operation]}</span> <span className="assert-value">{assertion.assertionPredicate}</span>


            </>
        )
    }
}

const IconCaretDown = <svg className="icon icon--caret-down" width="24px" height="24px" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M6 9L12 15L18 9" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>;
const IconCaretUp = <svg className="icon icon--caret-up" width="24px" height="24px" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M6 15L12 9L18 15" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>;
const IconPassed = <svg className="icon icon--status-passed" width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000" strokeWidth="1.5"><path fillRule="evenodd" clipRule="evenodd" d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM7.53044 11.9697C7.23755 11.6768 6.76268 11.6768 6.46978 11.9697C6.17689 12.2626 6.17689 12.7374 6.46978 13.0303L9.46978 16.0303C9.76268 16.3232 10.2376 16.3232 10.5304 16.0303L17.5304 9.03033C17.8233 8.73744 17.8233 8.26256 17.5304 7.96967C17.2375 7.67678 16.7627 7.67678 16.4698 7.96967L10.0001 14.4393L7.53044 11.9697Z" fill="#000000"></path></svg>;
const IconFailed = <svg className="icon icon--status-failed" width="24px" height="24px" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M9.17218 14.8284L12.0006 12M14.829 9.17157L12.0006 12M12.0006 12L9.17218 9.17157M12.0006 12L14.829 14.8284" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>;

const SingleAssertion = ({
    assertion,
    testNum,
    assertionNum,
    setSelectedResults,
    results,
    expanded,
    loading,
    updateViewStatus,
    timeNow,
}: {
    assertion: Assertion,
    testNum: number,
    assertionNum: number;
    setSelectedResults: (result: null | AssertionResult) => void,
    results: AssertionResult | null,
    expanded: boolean,
    loading: boolean,
    updateViewStatus: (index: number, newStatus: Partial<AssertionViewStatus>) => void;
    timeNow: number;
}) => {

    const runOnClick = async () => {
        updateViewStatus(assertionNum, {
            loading: true,
            result: null
        });
        const evaluationResult = await assertion.evaluate();
        updateViewStatus(assertionNum, {
            loading: false,
            result: evaluationResult,
            expanded: true
        });
    }

    let timeDiffString = "";

    if (results && results?.lastRun) {
        const timeDiff = timeNow - results.lastRun.getTime();
        const timeDiffInSeconds = timeDiff / 1000;
        const timeDiffInMinutes = timeDiffInSeconds / 60;
        const timeDiffInHours = timeDiffInMinutes / 60;
        const timeDiffInDays = timeDiffInHours / 24;

        if (timeDiffInDays >= 1) {
            timeDiffString = Math.round(timeDiffInDays) + " days ago";
        } else if (timeDiffInHours >= 1) {
            timeDiffString = Math.round(timeDiffInHours) + " hours ago";
        } else if (timeDiffInMinutes >= 1) {
            timeDiffString = Math.round(timeDiffInMinutes) + " minutes ago";
        } else {
            timeDiffString = "just now";
        }
    }

    let assertionStatus = null;

    if (results && results.passed) {
        assertionStatus = (
            <>
                <div className="assertion-status assertion-status--passed">
                    {IconPassed}
                </div>
                <div className="visually-hidden">Passed</div>
            </>
        )
    }
    if (results && !results.passed) {
        assertionStatus = (
            <>
                <div className="assertion-status assertion-status--failed">
                    {IconFailed}
                </div>
                <div className="visually-hidden">Failed</div>
            </>
        )
    }

    return (
        <>
            <div className="heading-wrap">

                <h3 id={`accordion-${testNum}-${assertionNum}`} className={`accordion-list-item__heading accordion-list-item__heading--${expanded ? "expanded" : "collapsed"}`}>

                    <button
                        type="button"
                        aria-expanded={expanded}
                        aria-controls={`section-${testNum}-${assertionNum}`}
                        onClick={() => {
                            updateViewStatus(assertionNum, { expanded: !expanded })
                        }}
                    >
                        {expanded ? IconCaretUp : IconCaretDown}
                        <span className="clickable-heading-text">{printAssertion(assertion)}</span>
                    </button>
                </h3>


                <div className="button-wrap">

                    {results ? assertionStatus : null}

                    {loading ? "Loading" :
                        <button onClick={runOnClick} className="accordion-list-item__button accordion-list-item__run-button">
                            <svg aria-hidden="true" className="icon icon--play-button" width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000" strokeWidth="1.5"><path d="M6.90588 4.53682C6.50592 4.2998 6 4.58808 6 5.05299V18.947C6 19.4119 6.50592 19.7002 6.90588 19.4632L18.629 12.5162C19.0211 12.2838 19.0211 11.7162 18.629 11.4838L6.90588 4.53682Z" fill="#000000" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                            <span className="visually-hidden">Run assertion &ldquo;{printAssertion(assertion)}&ldquo;</span>
                        </button>
                    }





                </div>

            </div>

            <section className="accordion-list-item__expandable-section" aria-labelledby={`accordion-${testNum}-${assertionNum}`} style={{ display: expanded ? "block" : "none" }}>
                <h4>Results</h4>
                {results ?
                    (
                        <>
                            <p>{results.passed ? "PASSED" : "FAILED"}</p>
                            <p>{results.milliseconds ? "Duration: " + results.milliseconds + "ms" : null}</p>
                            <p>{results.lastRun ? "Last run " + timeDiffString : null}</p>
                        </>
                    ) : "Test not yet run"
                }

            </section>
        </>
    )
}

interface AssertionViewStatus {
    expanded: boolean;
    result: AssertionResult | null;
    loading: boolean;
}

const SingleTest = ({
    test,
    testNum,
    setSelectedResults
}: {
    test: SnowTest,
    testNum: number,
    setSelectedResults: (result: null | AssertionResult) => void
}) => {
    const [expanded, setExpanded] = useState<boolean>(true);
    const [viewStatuses, setViewStatuses] = useState<AssertionViewStatus[]>(test.assertions.map(() => ({ expanded: false, result: null, loading: false })));
    const updateViewStatus = (index: number, newStatus: Partial<AssertionViewStatus>) => {
        const copy = [...viewStatuses];
        if (newStatus.expanded !== undefined) {
            copy[index].expanded = newStatus.expanded;
        }
        if (newStatus.loading !== undefined) {
            copy[index].loading = newStatus.loading;
        }
        if (newStatus.result !== undefined) {
            copy[index].result = newStatus.result;
        }
        setViewStatuses(copy);
    }

    const [timeNow, setTimeNow] = useState<number>(-1);

    const onComponentMount = useEffectEvent(() => {
        setTimeNow(Date.now());
    })

    useEffect(() => {
        onComponentMount();
    }, []);

    useEffect(() => {

        const timeEveryMinute = setInterval(() => {
            setTimeNow(Date.now());
        }, 1000 * 60);

        return () => {
            clearInterval(timeEveryMinute);
        }

    }, []);

    return (
        <li className="accordion-list-item">

            <div className="heading-wrap">

                <h2 id={`accordion-${testNum}`} className={`accordion-list-item__heading accordion-list-item__heading--${expanded ? "expanded" : "collapsed"}`}>
                    <button type="button" aria-expanded={expanded} aria-controls={`section-${testNum}`} onClick={() => setExpanded(!expanded)}>
                        {expanded ? IconCaretUp : IconCaretDown}
                        <span className="clickable-heading-text">{test.desc}</span>
                    </button>
                </h2>

                <div className="button-wrap">


                    <button onClick={async () => {
                        for (let i = 0; i < test.assertions.length; i++) {
                            updateViewStatus(i, {
                                loading: true,
                                result: null
                            });
                            const results = await test.assertions[i].evaluate();
                            updateViewStatus(i, {
                                loading: false,
                                result: results,
                                expanded: true
                            });
                        }
                        test.runAll();
                    }} className="accordion-list-item__button accordion-list-item__run-button">
                        Run all
                    </button>



                </div>

            </div>

            <section aria-labelledby={`accordion-${testNum}`} style={{ display: expanded ? "block" : "none" }} className="accordion-list-item__expandable-section">
                <ol>
                    {test.assertions.map((assertion, assertionNum) => {
                        return (
                            <li key={`test${testNum}-assertion${assertionNum}`} className="accordion-list-item">
                                <SingleAssertion
                                    assertion={assertion}
                                    testNum={testNum}
                                    assertionNum={assertionNum}
                                    setSelectedResults={setSelectedResults}
                                    results={viewStatuses[assertionNum].result}
                                    expanded={viewStatuses[assertionNum].expanded}
                                    loading={viewStatuses[assertionNum].loading}
                                    updateViewStatus={updateViewStatus}
                                    timeNow={timeNow}
                                />
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