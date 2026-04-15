"use client";

import { Storm } from "./model/Storm";

import "../spec/tests";
import { TestView } from "./components/TestView";
import { TableView } from "./components/TableView";
import { useEffect, useState } from "react";
import { AssertionResult } from "./model/AssertionResult";

export default function Home() {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        const isClientWrapper = async () => setIsClient(true);
        isClientWrapper();
    }, [])
    console.log(Storm.tests);
    const [selectedResults, setSelectedResults] = useState<null | AssertionResult>(null);
    if (!isClient) {
        return "Loading"
    }
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
