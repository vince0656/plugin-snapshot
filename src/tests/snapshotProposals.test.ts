import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { SnapshotAPI } from "../api/SnapshotAPI";

describe("SnapshotProposalsProvider", () => {
    let client: SnapshotAPI;

    const space = "uniswapgovernance.eth";

    beforeEach(() => {
        vi.clearAllMocks();
        client = new SnapshotAPI(undefined);
    });

    afterEach(() => {
        vi.clearAllTimers();
    });

    describe("Snapshot api", () => {
        it("should be able to get proposals from uniswap's snapshot space", async () => {
            const proposals = await client.getProposalsFromSnapshotSpace([space]);
            console.log(proposals[0]);
            expect(proposals.length).toBeGreaterThan(0);
            expect(proposals[0].space.name).toEqual('Uniswap');
        });

        it("should throw error when empty array is supplied", async () => {
            const emptyArray: string[] = [];
            await expect(client.getProposalsFromSnapshotSpace(emptyArray)).rejects.toThrow(
                "Spaces array must be defined and contain non-empty strings"
            );
        });

        it("should throw error when array contains empty string", async () => {
            const arrayWithEmptyString = ["uniswapgovernance.eth", ""];
            await expect(client.getProposalsFromSnapshotSpace(arrayWithEmptyString)).rejects.toThrow(
                "Spaces array must be defined and contain non-empty strings"
            );
        });

        it("should format proposal data correctly", async () => {
            const proposals = await client.getProposalsFromSnapshotSpace([space]);
            const singleProposal = [proposals[0]];
            const formattedData = client.formatLatestProposalsData(singleProposal);

            expect(formattedData).toMatch(/^Proposal ID: .+/);
            expect(formattedData).toMatch(/\nTitle: .+/);
            expect(formattedData).toMatch(/\nBody: .+/);
            expect(formattedData).toMatch(/\nChoices: .+/);
            expect(formattedData).toMatch(/\nStart: \d+/);
            expect(formattedData).toMatch(/\nEnd: \d+/);
            expect(formattedData).toMatch(/\nSnapshot: .+/);
            expect(formattedData).toMatch(/\nState: .+/);
            expect(formattedData).toMatch(/\nScores: .+/);
            expect(formattedData).toMatch(/\nScores Total: .+/);
            expect(formattedData).toMatch(/\nScores Updated: .+/);
            expect(formattedData).toMatch(/\nAuthor: .+\n\n$/);
        });
    });
});
