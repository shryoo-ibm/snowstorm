import { Assertion } from "./Storm";

export interface AssertionResult {
    passed: boolean;
    assertion: Assertion;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
}