// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract ClientContract {
    
    struct Client {
        address _client_id;
        string _client_name;
    }

    struct Perscription {
        string _drug_id;
        string _drug_name;
        address _client_id;
        uint256 _givenDate;
        uint256 _expiredDate;
    }

    struct Request {
        uint _request_number;
        uint256 _requestDate;
        Perscription _perscription;
    }
        
    uint public clientCount = 0;
    Client[] public clients;
    
    uint public requestCount = 0;
    Request[] requests;
    
    
    uint public perscriptionCount = 0;
    Perscription[] public perscriptions;
    
    address[] private permitted;
    address owner;
    
    
    function onlyPermittedDoctor(address sender) public view returns(bool){
        for(uint i; i < permitted.length; i++){
            if(sender == permitted[i]){
                return true;
            }
        }
        return false;
    }

    modifier isDoctor(){
        require(onlyPermittedDoctor(msg.sender), 'caller is not a doctor');
        _;
    }

    constructor() public {
        owner = msg.sender;
        permitted.push(owner);
    }
    
    function getPermittedList() public view returns(address[] memory) {
        return permitted;
    }
    
    function getPerscription(uint index) public view returns(address, string memory, string memory, uint256, uint256) {
        return (perscriptions[index]._client_id, perscriptions[index]._drug_id, perscriptions[index]._drug_name, perscriptions[index]._givenDate, perscriptions[index]._expiredDate);
    }
    
    function requestPerscription(address _client_id, string memory _drug_id, string memory _drug_name, uint256 _requestDate) public {
        requests.push(Request(requestCount, _requestDate, Perscription(_drug_id, _drug_name, _client_id, 0, 0)));
        requestCount++;
    }

    function getRequest(uint index) public view isDoctor returns(uint, address, string memory, string memory, uint256) {
        return (requests[index]._request_number, requests[index]._perscription._client_id, requests[index]._perscription._drug_id, requests[index]._perscription._drug_name, requests[index]._requestDate);
    }

    function givePerscriptionWithIndex(address _client_id, string memory _drug_id, string memory _drug_name, uint _index, uint256 _givenDate, uint256 _expiredDate) public isDoctor {
        perscriptions.push(Perscription(_drug_id, _drug_name, _client_id, _givenDate, _expiredDate));
        perscriptionCount++;
        removeRequest(_index);
    }
    
    function givePerscriptionWithoutIndex(address _client_id, string memory _drug_name, string memory _drug_id, uint256 _givenDate, uint256 _expiredDate) public isDoctor {
        perscriptions.push(Perscription(_drug_id, _drug_name, _client_id, _givenDate, _expiredDate));
        perscriptionCount++;
        removeRequestWithoutIndex(_client_id, _drug_id);
    }
    
    function removeRequest(uint index) public isDoctor {
        if (index >= requestCount) revert('bad index');
        
        for (uint i = index; i < requestCount-1; i++){
            requests[i] = requests[i+1];
            requests[i]._request_number--;
        }
        requests.pop();
        requestCount--;
    }
    
    function removeRequestWithoutIndex(address _client_id, string memory _drug_id) public isDoctor {
        for (uint i = 0; i < requestCount; i++) {
            if (requests[i]._perscription._client_id == _client_id) {
                if (keccak256(bytes(requests[i]._perscription._drug_id)) == keccak256(bytes(_drug_id))) {
                    removeRequest(i);
                    break;
                }
            }
        }
    }
}