
# Chapa-Node

This library allows you to easily add Chapa as a payment method using nodejs 



## Installation

With npm

```bash
  npm install chapa-node
```
Or yarn

```bash
  yarn add chapa-node
```
    
## Usage

```javascript
const Chapa  =  require('chapa-node')

const chapa = new Chapa('chapaKey')

//initialize payment
const initializeInfo = {
    'amount': '1000',
    'currency': 'ETB',
    'email': 'abebe@kebede.com',
    'first_name': 'Abebe',
    'last_name': 'Kebede',
    'tx_ref': 'tx-ref-A110000...',
    'callback_url': 'https://myapp.com/my-verify-endpoint',
    'customization[title]': 'My App Title',
    'customization[description]': 'Pay to my app'
}

chapa.initialize(initializeInfo)
    .then(response=>{
    console.log(response);
    /*if initialization was successfull response will look like this
        {
        "message": "Hosted Link",
        "status": "success",
        "data": {
            "checkout_url": "https://checkout.chapa.co/checkout/payment/27291184910"
        }

        redirect users to this 'checkout_url' to complete the transaction
    */
    })
    .catch(error=>{
        console.log(error)
    })

//verify payment by transaction refrence
chapa.verify('tx_ref')
    .then(response=>console.log(response))
    .catch(error=>console.log(error))

```

## More Information
Visit https://chapa.co/
