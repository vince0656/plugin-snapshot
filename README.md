# @vdecentralised/plugin-snapshot

[Snapshot.box](https://snapshot.box/) plugin for Eliza OS that provides Snapshot data access through providers for richer web3 governance.

## Overview

This plugin provides functionality to:
- Get the latest snapshot proposals from a given ENS name.

## Installation

```bash
npm install @vdecentralised/plugin-snapshot
# or
yarn add @vdecentralised/plugin-snapshot
# or
pnpm add @vdecentralised/plugin-snapshot
```

## Configuration

The plugin requires the following environment variables:

```env
# The space ENS names to monitor for snapshot proposals.
SNAPSHOT_ENS_NAMES=uniswapgovernance.eth,balancer.eth

# The base URL for the snapshot API.
SNAPSHOT_API_BASE_URL=https://hub.snapshot.org/graphql

# The number of proposals to fetch from the snapshot space.
SNAPSHOT_PROPOSAL_FETCH_LIMIT=5

# The number of proposals to skip from the snapshot space.
SNAPSHOT_PROPOSAL_FETCH_SKIP=0
```

Copy the `.env.example` file to `.env` and set the `SNAPSHOT_ENS_NAMES` variable to the ENS spaces you want to monitor.

## Usage

Import and register the plugin in your Eliza configuration:

```typescript
import { snapshotPlugin } from "@vdecentralised/plugin-snapshot";

export default {
    plugins: [snapshotPlugin],
    // ... other configuration
};
```

## Features

### Get the latest snapshot proposals from a given ENS name.

```typescript
// Example conversation
User: "What's the latest snapshot proposal activity?";
Assistant: "I'll have a look now...";
```

## API Reference


### Providers

- `snapshotProposalsProvider`: Get the latest snapshot proposals from a given set of ENS names.

## Development

### Building

```bash
pnpm run build
```

### Testing

```bash
pnpm run test
```

## Dependencies
- axios
- Other standard dependencies listed in package.json

## Future Enhancements

We welcome community feedback and contributions to help prioritize enhancements.

## Contributing

Contributions are welcome! Please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for more information.

## Credits

This plugin integrates with and builds upon several key technologies:
- [Snapshot](https://snapshot.box/): Snapshot.box is a platform for creating and managing gass-less proposals.

Special thanks to:
- The Eliza community

## License

MIT
