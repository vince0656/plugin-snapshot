import axios, { type AxiosInstance } from "axios";
import { Proposal } from "../types";
//import type { IAgentRuntime } from "@elizaos/core";
//import { Service, ServiceType } from "@elizaos/core";

export class SnapshotAPI {
    // TODO: Add service type
    //static serviceType: ServiceType = ServiceType.WEB_SEARCH;
    
    instance: AxiosInstance;

    constructor(overrideBaseUrl?: string) {
        // Initialize the axios service
        this.instance = axios.create({ baseURL: overrideBaseUrl || 'https://hub.snapshot.org/graphql' });
    }

    async getProposalsFromSnapshotSpace(spaces: string[]): Promise<Proposal[]> {
        if (!Array.isArray(spaces) || spaces.length === 0 || spaces.some(space => !space || space === "")) {
            throw new Error("Spaces array must be defined and contain non-empty strings");
        }

        let response;
        try {
            response = await this.instance.post('', {
                query: `
                    query {
                        proposals (
                            first: 20,
                            skip: 0,
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
        } catch (error) {
            throw new Error("Failed to fetch proposals from Snapshot API", error);
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