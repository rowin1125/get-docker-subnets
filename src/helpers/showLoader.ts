import cliSpinners = require("cli-spinners");

// Function to display a loading spinner
export const showLoading = () => {
  const spinner = cliSpinners.bouncingBar;
  let i = 0;
  return setInterval(() => {
    process.stdout.write(
      `\r${spinner.frames[i]} 🔍️ Searching for the subnets... 🗃️`
    );
    i = (i + 1) % spinner.frames.length;
  }, spinner.interval);
};
