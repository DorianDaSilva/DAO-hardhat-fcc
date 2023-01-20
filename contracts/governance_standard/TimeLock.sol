// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract TimeLock is TimelockController {
    constructor(
        uint256 minDelay, //delay before execution
        address[] memory proposers, //list of addresses that can propose
        address[] memory executors, //Can execute when a proposal passes
        address admin // admin role; disable with zero address
    ) TimelockController(minDelay, proposers, executors, admin) {}
}