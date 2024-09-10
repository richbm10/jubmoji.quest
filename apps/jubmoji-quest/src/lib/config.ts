import path from "path";

// In our current configuration, this is the path to the circuits directory for client side proving
export const getClientPathToCircuits = (): string => {
  return __dirname + "circuits/";
};

// In our current configuration, this is the path to the circuits directory for server side proving
export const getServerPathToCircuits = (): string => {
  return path.resolve(process.cwd(), "public", "circuits") + "/";
};

// In our current configuration, this is the path to the circuits directory for client side proving
export const getClientPathToLocationCircuits = (): string => {
  return __dirname + "circuits/location_circuits";
};

// In our current configuration, this is the path to the circuits directory for server side proving
export const getServerPathToLocationCircuits = (): string => {
  return path.resolve(process.cwd(), "public", "circuits", "location_circuits") + "/";
};
