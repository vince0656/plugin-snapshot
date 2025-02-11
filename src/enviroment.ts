import type { IAgentRuntime } from "@elizaos/core";
import { z } from "zod";

export const snapshotEnvSchema = z.object({
    SNAPSHOT_ENS_NAMES: z.string().min(1, "Snapshot Plugin: ENS names are required"),
    SNAPSHOT_API_BASE_URL: z.string().optional(),
});

export type SnapshotConfig = z.infer<typeof snapshotEnvSchema>;

export async function validateSnapshotConfig(
    runtime: IAgentRuntime
): Promise<SnapshotConfig> {
    try {
        const config = {
            SNAPSHOT_ENS_NAMES:
                runtime.getSetting("SNAPSHOT_ENS_NAMES") ||
                process.env.SNAPSHOT_ENS_NAMES,
            SNAPSHOT_API_BASE_URL:
                runtime.getSetting("SNAPSHOT_API_BASE_URL") ||
                process.env.SNAPSHOT_API_BASE_URL,
        };

        return snapshotEnvSchema.parse(config);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("\n");
            throw new Error(
                `Snapshot configuration validation failed:\n${errorMessages}`
            );
        }
        throw error;
    }
}
