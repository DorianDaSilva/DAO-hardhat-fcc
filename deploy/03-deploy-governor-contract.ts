import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import {
    networkConfig,
    developmentChains,
    VOTING_DELAY,
    VOTING_PERIOD,
    QUORUM_PERCENTAGE,
} from "../helper-hardhat-config";
import verify from "../utils/verify";
import { network } from "hardhat";



const deployMyGovernor: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    //@ts-ignore
    const { getNamedAccounts, deployments} = hre;
    const { deploy, log, get } = deployments;
    const { deployer } = await getNamedAccounts();
    const governanceToken = await get("GovernanceToken");
    const timeLock = await get("TimeLock");
    log("____________________________________________________")
    log("Deploying Governor Contract...");

    const myGovernor = await deploy("MyGovernor", {
        from: deployer,
        args: [
            governanceToken.address,
            timeLock.address,
            VOTING_DELAY,
            VOTING_PERIOD,
            QUORUM_PERCENTAGE,
        ],
        log: true,
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    });
    log(`My Governor Contract at ${myGovernor.address}`)

//verify TS
    //@ts-ignore
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(timeLock.address, [])
    }
    log("Contract verified!!!")
};

export default deployMyGovernor;
deployMyGovernor.tags = ["all", "myGovernor"]