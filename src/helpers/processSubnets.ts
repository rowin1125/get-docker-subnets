import { SubnetInfo } from "../main";

type ProcessSubnetsType = {
    results: {
        projectName: string;
        subnets: string[];
    }[];
};

export const processSubnets = ({ results }: ProcessSubnetsType) => {
    const allSubnets: SubnetInfo[] = [];
    const subnetsMap = new Map<string, string[]>();
    results.forEach(({ projectName, subnets }) => {
        subnets.forEach((subnet) => {
            if (!subnetsMap.has(subnet)) {
                subnetsMap.set(subnet, []);
            }

            subnetsMap.get(subnet)?.push(projectName);
            allSubnets.push({ projectName, subnet });
        });
    });

    // Display project names and subnets in a table format
    console.log("\nProject Name              | Subnet");
    console.log("--------------------------|--------------");
    allSubnets.forEach(({ projectName, subnet }) => {
        console.log(`${projectName.padEnd(26)}| ${subnet}`);
    });

    return { allSubnets, subnetsMap };
};
