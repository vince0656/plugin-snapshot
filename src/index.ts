import { Plugin } from "@elizaos/core";
import { snapshotProposalsProvider } from "./providers/snapshotProposals";
import { SnapshotAPI } from "./api/SnapshotAPI";

export { snapshotProposalsProvider, SnapshotAPI };

export const snapshotPlugin: Plugin = {
    name: "snapshot",
    description: "Snapshot.box Plugin for Eliza",
    actions: [],
    evaluators: [],
    providers: [snapshotProposalsProvider],
    services: [],
};

export default snapshotPlugin;
