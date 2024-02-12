import * as fs from "fs";
import { performance } from "perf_hooks";

import { displayMetrics } from "./helpers/displayMetrics";
import { processDuplicateSubnets } from "./helpers/processDuplicateSubnets";
import { processSubnets } from "./helpers/processSubnets";
import { searchDockerCompose } from "./helpers/searchDockerCompose";
import { showLoading } from "./helpers/showLoader";

export interface SubnetInfo {
    projectName: string;
    subnet: string;
}

// Asynchronous function to execute the main logic
async function main(folder: string) {
    // Retrieve command line arguments
    const args = process.argv.slice(2);
    // Check if the correct number of arguments is provided
    if (args.length !== 1) {
        console.error("Usage: node script.js <folder>");
        process.exit(1); // Exit the process with an error code
    }

    try {
        // Check if the provided path is a directory
        const stats = await fs.promises.stat(folder);
        if (!stats.isDirectory()) {
            throw new Error(`Error: '${folder}' is not a directory.`);
        }
    } catch (err: unknown) {
        const error = err as Error;
        // Handle errors related to directory validation
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit the process with an error code
    }

    // Show a loading spinner while searching
    const loadingInterval = showLoading();
    const startTime = performance.now(); // Record start time for performance measurement

    try {
        // Search for docker-compose.yml files within the specified folder
        const { results, numFilesSearched, numFoldersSearched } =
            await searchDockerCompose(folder);
        const endTime = performance.now(); // Record end time for performance measurement
        clearInterval(loadingInterval); // Stop the loading spinner

        // Process search results to extract subnets and project names
        const { allSubnets, subnetsMap } = processSubnets({ results });

        // Display additional table for duplicate subnets
        const { duplicateSubnets } = processDuplicateSubnets({
            allSubnets,
            subnetsMap,
        });

        displayMetrics({
            duplicateSubnets,
            endTime,
            numFilesSearched,
            numFoldersSearched,
            results,
            startTime,
        });
    } catch (err: unknown) {
        const error = err as Error;
        clearInterval(loadingInterval); // Stop the loading spinner in case of error
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit the process with an error code
    }
}

// Run the script
main(process.argv.slice(2)[0]);
