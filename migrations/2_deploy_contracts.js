const Medicine = artifacts.require("MedicineContract");
const Client = artifacts.require("ClientContract");

module.exports = function(deployer) {
    deployer.deploy(Medicine);
    deployer.deploy(Client);
};