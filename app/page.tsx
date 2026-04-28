"use client";

import { Storm } from "./model/Storm";

import { Quicksand } from "next/font/google";
import "../spec/tests";
import { TestView } from "./components/TestView";
import { TableView } from "./components/TableView";
import { useEffect, useState } from "react";
import { AssertionResult } from "./model/AssertionResult";
import { fetchStats } from "./utils/fetch-snow";

const quicksand = Quicksand({ subsets: ['latin'] });

export default function Home() {
    const [isClient, setIsClient] = useState(false);
    const [instanceVersion, setInstanceVersion] = useState<string>();
    const [instanceName, setInstanceName] = useState<string>();
    useEffect(() => {
        const isClientWrapper = async () => setIsClient(true);
        isClientWrapper();
        fetchStats().then((stats) => {
            setInstanceVersion(stats.instanceVersion);
            setInstanceName(stats.instanceName);
        });
    }, [])
    console.log(Storm.tests);
    const [selectedResults, setSelectedResults] = useState<null | AssertionResult>(null);
    if (!isClient) {
        return "Loading"
    }
    return (
        <div className={quicksand.className}>

            <div className="instance-details">
                <h1 className="instance-details__name">{instanceName}</h1>
                <div className="instance-details__version">{instanceVersion}</div>
            </div>
            <div className="panel-container">

                <div className="panel table-panel">
                    <TableView selectedResults={selectedResults} />
                </div>
                <div className="panel test-panel">
                    <TestView setSelectedResults={setSelectedResults} />
                </div>
            </div>
        </div>
    );
}
