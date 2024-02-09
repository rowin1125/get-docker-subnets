import * as path from "path";
import * as fs from "fs";

import excludedFolders from "../lib/excludedFolders";
import { extractSubnetAndProject } from "./extractSubnetAndProject";

// Function to recursively search for docker-compose.yml files
export  const searchDockerCompose = async(folder: string) =>{
  const dockerComposeFiles: string[] = [];
  let numFilesSearched = 0;
  let numFoldersSearched = 0;

  async function searchRecursively(currentFolder: string) {
    numFoldersSearched++;
    const files = await fs.promises.readdir(currentFolder);

    for (const file of files) {
      const filePath = path.join(currentFolder, file);
      const stats = await fs.promises.stat(filePath);

      numFilesSearched++;

      if (stats.isDirectory()) {
        // Check if the current directory should be excluded
        const excluded = excludedFolders.some(excludedFolder =>
          filePath.endsWith(path.sep + excludedFolder)
        );
        if (excluded) {
          continue; // Skip the directory
        }
        await searchRecursively(filePath);
      } else if (file === "docker-compose.yml") {
        dockerComposeFiles.push(filePath);
      }
    }
  }

  await searchRecursively(folder);

  const results = await Promise.all(
    dockerComposeFiles.map(extractSubnetAndProject)
  );
  return { results, numFilesSearched, numFoldersSearched };
}
