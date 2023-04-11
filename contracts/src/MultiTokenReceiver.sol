// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MultiTokenReceiver {
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure returns (bytes4) {
        // Handle the ERC721 tokens received
        return this.onERC721Received.selector;
    }

    function tokensReceived(
        address,
        address,
        address,
        uint256,
        bytes calldata,
        bytes calldata
    ) external {}

    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes calldata
    ) external pure returns (bytes4) {
        // Handle the single ERC1155 token received
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] calldata,
        uint256[] calldata,
        bytes calldata
    ) external pure returns (bytes4) {
        // Handle the batch of ERC1155 tokens received
        return this.onERC1155BatchReceived.selector;
    }

    // Receive ETH.
    receive() external payable {}
}
