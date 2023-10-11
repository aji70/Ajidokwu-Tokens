// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyToken{

    uint public totalSupply = 1000;
    string public name = 'Ajidokwu';
    string public symbol = 'AJI';
    uint public decimals = 18;
    address public owner;

    mapping(address => uint) balanceOf;
    mapping(address => mapping(address => uint))public allowance;
 
    event Transfer(address indexed from, address indexed to, uint value);
    event Approval(address indexed owner, address indexed spender, uint value);
    event Mint(address indexed to, uint value);
    event Burn(address from, uint value);

    constructor(){
        balanceOf[msg.sender] = totalSupply;
        owner = msg.sender;
    }

     modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _; // Continue with the function if the sender is the owner
    }
    function balance() public view returns(uint){
        return balanceOf[owner];
    }

    function transfer(address from, address to, uint value) public returns(bool Success){
        require(to !=address(0), "Invalid Address");
        require(balanceOf[msg.sender] >= value, "Insufficent Funds");
        from = msg.sender;
        balanceOf[from] -= value;
        balanceOf[to] += value;
        emit Transfer(from, to, value);
        return true;
    } 

    function approve(address spender, uint value) public returns (bool Success){
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint value) public returns(bool Success){
        require(to !=address(0), "Invalid Address");
        require(balanceOf[from] >= value, "Insufficent Funds");
        require(allowance[from][msg.sender] >= value, "Allowance Exceeded");
        balanceOf[to] += value;
        balanceOf[from] -= value;
        allowance[from][msg.sender] -= value;
        emit Transfer(from, to, value);
        return true;
    }

    function mint(address to, uint value) public onlyOwner {
        require(to !=address(0), "Invalid Address");
        require(totalSupply + value >= totalSupply, "OverFlow Detected");
        balanceOf[to] += value;
        totalSupply += value;
        emit Transfer(address (0), to, value);
        emit Mint(to, value);  
    }

    function burn(uint value) public {
        require(balanceOf[msg.sender] >= value, "Insufficent Funds");
        balanceOf[msg.sender] -= value;
        totalSupply -= value;
        emit Transfer(msg.sender, address(0), value);
        emit Burn(msg.sender, value);
    }

}
