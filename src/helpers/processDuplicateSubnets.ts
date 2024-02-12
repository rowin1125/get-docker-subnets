import { SubnetInfo } from "../main";

type ProcessDuplicateSubnetsType = {
    allSubnets: SubnetInfo[];
    subnetsMap: Map<string, string[]>;
};

export const processDuplicateSubnets = ({
    allSubnets,
    subnetsMap,
}: ProcessDuplicateSubnetsType) => {
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
        let previousSubnet: string | null = null;
        duplicateSubnets
            .sort((a, b) => a.subnet.localeCompare(b.subnet))
            .forEach(({ projectName, subnet }) => {
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

    return { duplicateSubnets };
};
