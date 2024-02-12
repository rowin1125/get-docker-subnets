import * as fs from "fs";
import * as path from "path";

// Asynchronous function to extract project name and subnets from a docker-compose.yml file
export const extractSubnetAndProject = async (
    filePath: string
): Promise<{ projectName: string; subnets: string[] }> => {
    // Read the content of the docker-compose.yml file
    const fileContent = await fs.promises.readFile(filePath, "utf-8");

    // Regular expression to extract subnet information from the file content
    const subnetRegex = /subnet:\s*([0-9.]+\/[0-9]+)/g;
    const subnets: string[] = []; // Array to store extracted subnets
    let match;

    // Iterate through each match of the subnet regex in the file content
    while ((match = subnetRegex.exec(fileContent)) !== null) {
        subnets.push(match[1]); // Push the subnet to the subnets array
    }

    // Extract the project name from the file path
    const projectName = path.basename(path.dirname(filePath));

    // Return an object containing the project name and extracted subnets
    return { projectName, subnets };
};
