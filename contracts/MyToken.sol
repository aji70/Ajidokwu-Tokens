// SPDX-License-Identifier: UnLicensed
pragma solidity >=0.5.0 <0.9.0;

contract Token{
	string public name = "Ajidokwu Token";
	string public symbol = "AJI";
	uint256 public totalSupply = 10000;

	address public owner;

	mapping (address => uint256) balances;

	constructor(){
		/* i.e the deployer will be the owner at first he can then transfer tokens to any 
		other account addresses and he will have all the tokens in his wallet at first.*/
		
		balances[msg.sender] = totalSupply;
		owner = msg.sender;
	}
     modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _; // Continue with the function if the sender is the owner
    }

	function transfer(address to, uint256 amount) external {
		require(balances[msg.sender]>=amount, "Not enough tokens");

		

		balances[msg.sender] -= amount;
		balances[to] += amount;

	}

	function balanceOf(address account) external view returns (uint256) {
		return balances[account];
	}

    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply + amount >= totalSupply, "OverFlow detected");
        balances[to] += amount;
        totalSupply += amount;
    }

    function burn(uint256 amount) external  onlyOwner {
        	require(balances[msg.sender]>=amount, "Not enough tokens");
            balances[msg.sender] -= amount;
            totalSupply -= amount;
    }

	function deposit() public payable {
		require(msg.sender != address(0), "caller is 0 address");
		balances[msg.sender] += msg.value;
	}
	
}
