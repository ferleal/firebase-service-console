const fs = require('fs');

require('dotenv').config({
  path: `${process.cwd()}/.env`
});

module.exports = {
  getServiceAccount() {
    const serviceAccountPath = `${process.cwd()}/serviceAccount.json`; // Check for local service account file (Local dev)

    if (fs.existsSync(serviceAccountPath)) {
      return module.exports.readJsonFile(serviceAccountPath); // eslint-disable-line global-require, import/no-dynamic-require
    } // Use environment variables (CI)


    const {
      SERVICE_ACCOUNT
    } = process.env;

    if (SERVICE_ACCOUNT) {
      try {
        return JSON.parse(SERVICE_ACCOUNT);
      } catch (err) {
        console.error(`Issue parsing "SERVICE_ACCOUNT" environment variable from string to object: `, err.message);
      }
    }

    return null;
  },

  readJsonFile(filePath) {
    if (!fs.existsSync(filePath)) {
      const errMsg = `File does not exist at path "${filePath}"`;
      /* eslint-disable no-console */

      console.error(errMsg);
      /* eslint-enable no-console */

      throw new Error(errMsg);
    }

    try {
      const fileBuffer = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileBuffer.toString());
    } catch (err) {
      console.error(`Unable to parse ${filePath.replace(process.cwd(), '')} - JSON is most likely not valid`);
      return {};
    }
  },

  getFirebaseEnv() {
    return process.env;
  }

};