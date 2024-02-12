import { SubnetInfo } from "../main";

type DisplayMetrics = {
    endTime: number;
    startTime: number;
    results: {
        projectName: string;
        subnets: string[];
    }[];
    numFilesSearched: number;
    numFoldersSearched: number;
    duplicateSubnets: SubnetInfo[];
};

export const displayMetrics = ({
    endTime,
    results,
    startTime,
    duplicateSubnets,
    numFilesSearched,
    numFoldersSearched,
}: DisplayMetrics) => {
    // Display metrics
    console.log("\nMetrics:");
    console.table({
        "Time spent searching: ": `${((endTime - startTime) / 1000).toFixed(
            2
        )} seconds`,
        "Number of files searched": `${numFilesSearched} files`,
        "Number of folders searched": `${numFoldersSearched} folders`,
        "Number of matching files found": `${results.length} files`,
        "Number of duplicate subnets found": `${duplicateSubnets.length} subnets`,
    });
};
