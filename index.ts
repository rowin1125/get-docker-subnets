import * as fs from "fs";
import * as path from "path";

import cliSpinners = require("cli-spinners");
import { performance } from "perf_hooks";

import excludedFolders from "./src/lib/excludedFolders";
import { extractSubnetAndProject } from "./src/helpers/extractSubnetAndProject";

interface SubnetInfo {
  projectName: string;
  subnet: string;
}

// Function to extract subnet values and project names from docker-compose.yml files

// Function to recursively search for docker-compose.yml files
async function searchDockerCompose(folder: string) {
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

// Function to display a loading spinner
function showLoading() {
  const spinner = cliSpinners.bouncingBar;
  let i = 0;
  return setInterval(() => {
    process.stdout.write(
      `\r${spinner.frames[i]} 🔍️ Searching for the subnets... 🗃️`
    );
    i = (i + 1) % spinner.frames.length;
  }, spinner.interval);
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  if (args.length !== 1) {
    console.error("Usage: node script.js <folder>");
    process.exit(1);
  }

  const folder = args[0];
  try {
    const stats = await fs.promises.stat(folder);
    if (!stats.isDirectory()) {
      throw new Error(`Error: '${folder}' is not a directory.`);
    }
  } catch (err: any) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }

  const loadingInterval = showLoading();
  const startTime = performance.now();

  try {
    const { results, numFilesSearched, numFoldersSearched } =
      await searchDockerCompose(folder);
    const endTime = performance.now();
    clearInterval(loadingInterval); // Stop the loading spinner

    const allSubnets: SubnetInfo[] = [];
    const subnetsMap = new Map<string, string[]>();
    results.forEach(({ projectName, subnets }) => {
      subnets.forEach(subnet => {
        if (!subnetsMap.has(subnet)) {
          subnetsMap.set(subnet, []);
        }

        subnetsMap.get(subnet)?.push(projectName);
        allSubnets.push({ projectName, subnet });
      });
    });

    console.log("\nProject Name              | Subnet");
    console.log("--------------------------|--------------");
    allSubnets.forEach(({ projectName, subnet }) => {
      console.log(`${projectName.padEnd(26)}| ${subnet}`);
    });

    // Display additional table for duplicate subnets
    console.log("\nDuplicate Subnets:");
    console.log("-------------------");
    const duplicateSubnets = allSubnets.filter(({ subnet }) => {
      if (!subnetsMap.has(subnet)) return false;
      const projects = subnetsMap.get(subnet);

      if (!projects) return false;

      return projects.length > 1;
    });

    if (duplicateSubnets.length === 0) {
      console.log("No duplicate subnets found.");
    } else {
      let previousSubnet: any = null;
      duplicateSubnets
        .sort((a, b) => a.subnet.localeCompare(b.subnet))
        .forEach(({ projectName, subnet }, index) => {
          if (subnet !== previousSubnet) {
            console.log(""); // Add space between subnet groups
          }
          console.log(
            "\x1b[31m%s\x1b[0m",
            `${projectName.padEnd(26)}| ${subnet}`
          );
          previousSubnet = subnet;
        });
    }

    // Display metrics
    console.log("\nMetrics:");
    console.table({
      "Time spent searching: ": `${((endTime - startTime) / 1000).toFixed(2)} seconds`,
      "Number of files searched": `${numFilesSearched} files`,
      "Number of folders searched": `${numFoldersSearched} folders`,
      "Number of matching files found": `${results.length} files`,
      "Number of duplicate subnets found": `${duplicateSubnets.length} subnets`,
    });
  } catch (err: any) {
    clearInterval(loadingInterval); // Stop the loading spinner in case of error
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

// Run the script
main();
