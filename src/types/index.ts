export interface Proposal {
    id: string;
    title: string;
    body: string;
    choices: string[];
    start: number;
    end: number;
    snapshot: number;
    state: string;
    scores: number[];
    scores_total: number;
    scores_updated: number;
    author: string;
    space: {
        id: string;
        name: string;
    };
}