"use client";

import { Storm } from "./model/Storm";

import "../spec/tests";
import { TestView } from "./components/TestView";
import { TableView } from "./components/TableView";
import { useState } from "react";
import { AssertionResult } from "./model/AssertionResult";

export default function Home() {
    console.log(Storm.tests);
    const [selectedResults, setSelectedResults] = useState<null | AssertionResult>(null);
    return (
        <>
            <h1>SnowStorm Tester</h1>
            <div className="panel-container">

                <div className="panel table-panel">
                    <TableView selectedResults={selectedResults} />
                </div>
                <div className="panel test-panel">
                    <TestView setSelectedResults={setSelectedResults} />
                </div>
            </div>
        </>
    );
}
