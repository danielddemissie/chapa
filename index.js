const fetch = require("node-fetch");

const chapaUrl = "https://api.chapa.co/v1";

/**
 *
 * @param {string} chapaKey
 */
module.exports.Chapa = function (chapaKey) {
  var chapaKey = chapaKey;
  var customization = {};

  /**
   *
   * @param {object} customizationInfo
   */
  this.customize = function (customizationInfo) {
    const expectedParams = ["title", "description", "logo"];
    const wrongParams = Object.keys(customizationInfo).filter(
      (key) => !expectedParams.includes(key)
    );
    if (wrongParams.length > 0) {
      throw new Error(
        `The customizationInfo has ${wrongParams.length} wrong paramater '${[
          ...wrongParams,
        ]}'`
      );
    }
    customization = customizationInfo;
  };

  /**
   *
   * @param {object} initializeInfo
   * @returns {Promise} initialize chapa peyment
   */
  this.initialize = function (initializeInfo) {
    const requiredParams = [
      "email",
      "amount",
      "first_name",
      "last_name",
      "tx_ref",
      "currency",
    ];
    let missingParams = [];

    missingParams = requiredParams.filter(
      (key) => !initializeInfo.hasOwnProperty(key)
    );
    if (missingParams.length > 0) {
      throw new Error(
        `The initializeInfo has ${
          missingParams.length
        } missing required paramater '${[...missingParams]}'`
      );
    }

    return new Promise((resolve, reject) => {
      const paylodad = { ...initializeInfo, customization };
      console.log(paylodad);
      fetch(`${chapaUrl}/transaction/initialize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + chapaKey,
        },
        body: JSON.stringify(paylodad),
      })
        .then(async (res) => {
          if (res.status === 200) {
            resolve(await res.json());
          } else {
            reject(await res.json());
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  /**
   *
   * @param {string} tnxRef
   * @returns {Promise} verfiy single transaction
   */
  this.verify = function (tnxRef) {
    if (!tnxRef) throw new Error("Transaction refrence is required!");

    return new Promise((resolve, reject) => {
      fetch(`${chapaUrl}/transaction/verify/${tnxRef}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + chapaKey,
        },
      })
        .then(async (res) => {
          if (res.status === 200) {
            resolve(await res.json());
          } else {
            reject(await res.json());
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  /**
   *
   * @param {object} transferInfo
   * @returns {Promise} transfer response
   */
  this.transfer = function (transferInfo) {
    const requiredParams = [
      "account_name",
      "account_number",
      "amount",
      "currency",
      "beneficiary_name",
      "reference",
      "bank_code",
    ];
    let missingParams = [];

    missingParams = requiredParams.filter(
      (key) => !transferInfo.hasOwnProperty(key)
    );
    if (missingParams.length > 0) {
      throw new Error(
        `The transferInfo has ${
          missingParams.length
        } missing required paramater '${[...missingParams]}'`
      );
    }

    return new Promise((resolve, reject) => {
      fetch(`${chapaUrl}/transfers`, {
        method: "POST",
        Authorization: "Bearer " + chapaKey,
        body: JSON.stringify(transferInfo),
      })
        .then(async (res) => {
          if (res.status === 200) {
            resolve(await res.json());
          } else {
            reject(await res.json());
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  /**
   *
   * @returns {Promise} Banks list
   */
  this.getBanks = function () {
    return new Promise((resolve, reject) => {
      fetch(`${chapaUrl}/banks`, {
        method: "GET",
        Authorization: "Bearer " + chapaKey,
      })
        .then(async (res) => {
          if (res.status === 200) {
            resolve(await res.json());
          } else {
            reject(await res.json());
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
};
