import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { ADDRESS_ZERO, developmentChains } from "../helper-hardhat-config";
import verify from "../utils/verify";

const setupContracts: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    //@ts-ignore
    const { getNamedAccounts, deployments} = hre;
    const { log } = deployments;
    const { deployer } = await getNamedAccounts();
    const timeLock = await ethers.getContract("TimeLock", deployer);
    const governor = await ethers.getContract("MyGovernor", deployer);

    log("Setting up roles");

    const proposerRole = await timeLock.PROPOSER_ROLE();
    const executorRole = await timeLock.EXECUTOR_ROLE();
    const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE();

    const proposerTx = await timeLock.grantRole(proposerRole, governor.address);
    await proposerTx.wait(1);

    const executorTx = await timeLock.grantRole(executorRole, ADDRESS_ZERO);
    executorTx.wait(1);

    const revokeTx = await timeLock.revokeRole(adminRole, deployer);
    revokeTx.wait(1)

//verify TS
    //@ts-ignore
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(timeLock.address, [])
    }
    log("Contract verified!!!")

};

export default setupContracts
setupContracts.tags = ["all", "setup"]

