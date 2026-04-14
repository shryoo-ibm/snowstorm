import { AssertionResult } from "../model/AssertionResult"

export const TableView = ({ selectedResults }: { selectedResults: null | AssertionResult }) => {
    if (selectedResults === null) {
        return (
            <p>Once an Assertion is run, select the associated table to see it displayed here.</p>
        )
    }
}