const fetch = require('node-fetch');

const initialize_url = 'https://api.chapa.co/v1/transaction/initialize';
const verify_url = 'https://api.chapa.co/v1/transaction/initialize';
const callback_url = 'https://chapa.co';

/**
 *
 * @param {string} chapaKey
 */
function Chapa(chapaKey) {
  this.chapaKey = chapaKey;
}

Chapa.prototype.initialize = function (options) {
  //varify all required fields are passed options
  return new Promise((resolve, reject) => {
    fetch(initialize_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.chapaKey,
      },
      body:JSON.stringify(options)
    }).then(async(res)=>{
      if(res.status===200){
        resolve(await res.json())
      }
    }).catch((error)=>{
      reject(error)
    })
  });
};


Chapa.prototype.verify = function(tnxRef){
  if(!tnxRef) throw new Error('Transaction refrence is required!')
  return new Promise((resolve,reject)=>{
    fetch(verify_url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.chapaKey,
      },
      body:JSON.stringify(options)
    }).then(async(res)=>{
      if(res.status===200){
        resolve(await res.json())
      }
    }).catch((error)=>{
      reject(error)
    })
  })
}

module.exports = Chapa;