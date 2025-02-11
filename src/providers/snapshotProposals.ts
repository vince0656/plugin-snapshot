import {
    elizaLogger,
    IAgentRuntime,
    Memory,
    Provider,
    State,
} from "@elizaos/core";

import { validateSnapshotConfig } from "../enviroment";
import { SnapshotAPI } from "../api/SnapshotAPI";

const snapshotProposalsProvider: Provider = {
    get: async (
        runtime: IAgentRuntime,
        _message: Memory,
        _state?: State
    ): Promise<string | null> => {
        try {
            const config = await validateSnapshotConfig(runtime);
            const api = new SnapshotAPI(config.SNAPSHOT_API_BASE_URL ?? undefined);
            const spaces = config.SNAPSHOT_ENS_NAMES;
            const proposals = await api.getProposalsFromSnapshotSpace(spaces.split(","));
            elizaLogger.info(`Fetched proposals from snapshot spaces ${spaces} and found ${proposals.length} proposals`);
            return api.formatLatestProposalsData(proposals);
        } catch (error) {
            elizaLogger.error("Error in proposals provider:", error);
            return null;
        }
    },
};

// Module exports
export { snapshotProposalsProvider };
