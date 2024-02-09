import * as fs from "fs";
import * as path from "path";

// Function to extract subnet values and project names from docker-compose.yml files
export const extractSubnetAndProject = async (
  filePath: string
): Promise<{ projectName: string; subnets: string[] }> => {
  const fileContent = await fs.promises.readFile(filePath, "utf-8");
  const subnetRegex = /subnet:\s*([0-9.]+\/[0-9]+)/g;
  const subnets: string[] = [];
  let match;
  while ((match = subnetRegex.exec(fileContent)) !== null) {
    subnets.push(match[1]);
  }
  const projectName = path.basename(path.dirname(filePath));
  return { projectName, subnets };
}
