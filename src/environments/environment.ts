// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  HttpProvider: "http://localhost:8545",
  MedicineContract: "0x27EC9369Cbb43D5EB10A8236dEC2Ea5e5718323e",
  ClientContract: "0xfF5E672A53E45759f91A7FA5e88D62D74E3e145A",
  Deployer: "0xe092b1fa25DF5786D151246E492Eed3d15EA4dAA"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
