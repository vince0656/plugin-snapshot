import axios, { type AxiosInstance } from "axios";
import { Proposal } from "../types";

export class SnapshotAPI {
    
    instance: AxiosInstance;

    /**
     * Constructor for the SnapshotAPI class
     * @param overrideBaseUrl Optional base URL to override the default Snapshot API URL
     */
    constructor(overrideBaseUrl?: string) {
        // Initialize the axios service
        this.instance = axios.create({ baseURL: overrideBaseUrl || 'https://hub.snapshot.org/graphql' });
    }

    /**
     * Fetches proposals from the Snapshot API for a given list of spaces
     * @param spaces Array of space names to fetch proposals from
     * @returns Array of Proposal objects
     * @throws Error if spaces array is empty or contains invalid data
     */
    async getProposalsFromSnapshotSpace(spaces: string[], first: number = 5, skip: number = 0): Promise<Proposal[]> {
        if (!Array.isArray(spaces) || spaces.length === 0 || spaces.some(space => !space || space === "")) {
            throw new Error("Spaces array must be defined and contain non-empty strings");
        }

        let response;
        try {
            response = await this.instance.post('', {
                query: `
                    query {
                        proposals (
                            first: ${first},
                            skip: ${skip},
                            where: {
                                space_in: ${JSON.stringify(spaces)}
                            },
                            orderBy: "created",
                            orderDirection: desc
                        ) {
                            id
                            title
                            body
                            choices
                            start
                            end
                            snapshot
                            state
                            scores
                            scores_total
                            scores_updated
                            author
                            space {
                                id
                                name
                            }
                        }
                    }
                `,
            });
        } catch {
            throw new Error("Failed to fetch proposals from Snapshot API");
        }

        // Validate the proposals response
        const proposals = response.data;
        if (
            !proposals.data ||
            !proposals.data.proposals ||
            !proposals.data.proposals.length ||
            proposals.data.proposals.length === 0
        ) {
            throw new Error("No proposal data found");
        }

        return proposals.data.proposals as Proposal[];
    }

    /**
     * Formats an array of Snapshot proposals into a human-readable string
     * @param proposals Array of Snapshot proposal objects to format
     * @returns Formatted string containing proposal details
     * @throws Error if proposals array is empty or contains invalid data
     */
    formatLatestProposalsData(proposals: Proposal[]): string {
        if (!Array.isArray(proposals) || proposals.length === 0) {
            throw new Error("No valid proposals data provided");
        }

        return proposals
            .map((proposal) => {
                // Validate required fields
                if (!proposal.id || !proposal.title || !proposal.body || !proposal.choices) {
                    throw new Error(`Invalid proposal data found: Missing required fields`);
                }

                // Validate that choices is an array
                if (!Array.isArray(proposal.choices)) {
                    throw new Error(`Invalid proposal choices format for proposal ${proposal.id}`);
                }

                // Validate timestamps
                if (!proposal.start || !proposal.end || isNaN(Number(proposal.start)) || isNaN(Number(proposal.end))) {
                    throw new Error(`Invalid timestamp data for proposal ${proposal.id}`);
                }

                return `Proposal ID: ${proposal.id}\nTitle: ${proposal.title}\nBody: ${proposal.body}\nChoices: ${proposal.choices.join(", ")}\nStart: ${proposal.start}\nEnd: ${proposal.end}\nSnapshot: ${proposal.snapshot}\nState: ${proposal.state}\nScores: ${proposal.scores}\nScores Total: ${proposal.scores_total}\nScores Updated: ${proposal.scores_updated}\nAuthor: ${proposal.author}\n\n`;
            })
            .join("");
    }

}