// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract MedicineContract {
    
    struct Medicine {
        string _id;
        string _drugName;
        string _brandName;
        uint _price;
    }
    
    address owner;
    
    uint public medicineCount = 0;
    Medicine[] public medicines;
    
    modifier isDoctor() {
        require(msg.sender == owner, "caller is not a doctor");
        _;
    }
    
    constructor() public {
        owner = msg.sender;
    }
    
    function addDrug(string memory _id, string memory _medicine, string memory _brandName, uint _price) public {
        medicines.push(Medicine(_id, _medicine, _brandName, _price));
        medicineCount++;
    }
    
    function removeDrug(uint index) public isDoctor {
        if (index >= medicines.length) return;

        for (uint i = index; i < medicines.length-1; i++){
            medicines[i] = medicines[i+1];
        }
        delete(medicines[medicines.length-1]);
        medicineCount--;
    }

    function getMedicine(uint index) public view returns(string memory, string memory, string memory, uint) {
        // if (index >= medicineCount) return ("","", "", 0);
        return (medicines[index]._id, medicines[index]._drugName, medicines[index]._brandName, medicines[index]._price);
    }
}