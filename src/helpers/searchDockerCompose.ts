import * as fs from "fs";
import * as path from "path";

import excludedFolders from "../lib/excludedFolders";
import { extractSubnetAndProject } from "./extractSubnetAndProject";

// Function to recursively search for docker-compose.yml files
export const searchDockerCompose = async (folder: string) => {
    const dockerComposeFiles: string[] = []; // Array to store paths of docker-compose.yml files
    let numFilesSearched = 0; // Counter to keep track of the number of files searched
    let numFoldersSearched = 0; // Counter to keep track of the number of folders searched

    // Recursive function to search for docker-compose.yml files
    const searchRecursively = async (currentFolder: string) => {
        numFoldersSearched++; // Increment the folder counter
        const files = await fs.promises.readdir(currentFolder); // Read the contents of the current folder

        // Iterate through each file in the current folder
        for (const file of files) {
            const filePath = path.join(currentFolder, file); // Get the full path of the file
            const stats = await fs.promises.stat(filePath); // Get the file stats

            numFilesSearched++; // Increment the file counter

            // Check if the current item is a directory
            if (stats.isDirectory()) {
                // Check if the current directory should be excluded
                const excluded = excludedFolders.some((excludedFolder) =>
                    filePath.endsWith(path.sep + excludedFolder)
                );
                if (excluded) {
                    continue; // Skip the directory if it's excluded
                }
                await searchRecursively(filePath); // Recursively search the subdirectory
            } else if (file === "docker-compose.yml") {
                dockerComposeFiles.push(filePath); // Add the path to docker-compose.yml file to the array
            }
        }
    };

    await searchRecursively(folder); // Start the recursive search from the specified folder

    // Extract subnet and project information from each docker-compose.yml file asynchronously
    const results = await Promise.all(
        dockerComposeFiles.map(extractSubnetAndProject)
    );

    // Return the results along with the number of files and folders searched
    return { results, numFilesSearched, numFoldersSearched };
};
