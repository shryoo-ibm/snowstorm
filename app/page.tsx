import { printAssertion, Storm } from "./model/Storm";

import "../spec/tests";

export default function Home() {
    console.log(Storm.tests);
    return (
        <>
            <h1>SnowStorm Tester</h1>
            <ol>
                {Storm.tests.map((test, i) => {
                    return (
                        <li key={`test${i}`}>
                            <h2>{test.desc}</h2>
                            <ol>
                                {test.assertions.map((assertion, j) => {
                                    return (
                                        <li key={`test${i}-assertion${j}`}>
                                            {printAssertion(assertion)}
                                        </li>
                                    )
                                })}
                            </ol>
                        </li>
                    );
                })}
            </ol>
        </>
    );
}
