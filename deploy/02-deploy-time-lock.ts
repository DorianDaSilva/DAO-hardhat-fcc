import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { MIN_DELAY, networkConfig, developmentChains, ADDRESS_ZERO } from "../helper-hardhat-config";
import verify from "../utils/verify";
import { network } from "hardhat";



const deployTimeLock: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    //@ts-ignore
    const { getNamedAccounts, deployments } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    log("Deploying Timelock...");

    const timeLock = await deploy("TimeLock", {
        from: deployer,
        //args: [MIN_DELAY, [], [], ADDRESS_ZERO],
        args: [MIN_DELAY, [], [], deployer ],
        log: true,
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    });
    log(`TimeLock at ${timeLock.address}`)

    //verify TS
    //@ts-ignore
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(timeLock.address, [])
    }
    log("Contract verified!!!")
};

export default deployTimeLock;
deployTimeLock.tags = ["all", "timeLock"]