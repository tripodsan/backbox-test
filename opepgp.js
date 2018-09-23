const openpgp = require('openpgp');
const fs = require('fs');

const privkey = fs.readFileSync('privkey.asc', 'utf-8');
const pubkey = fs.readFileSync('pubkey.asc', 'utf-8');

const pgpMsg = fs.readFileSync('secret.txt.gpg');
const plainMsg = fs.readFileSync('secret.txt', 'utf-8');

const passphrase = '';

async function encrypt()  {
    const options = {
      message: openpgp.message.fromText(plainMsg),
      publicKeys: (await openpgp.key.readArmored(pubkey)).keys,
    };

    return openpgp.encrypt(options).then(ciphertext => {
      return ciphertext.data;
    })
}

async function decrypt() {
  const privKeyObj = (await openpgp.key.readArmored(privkey)).keys[0];
  // await privKeyObj.decrypt(passphrase);

  const options = {
    message: await openpgp.message.read(pgpMsg),
    privateKeys: [privKeyObj] ,
  };

  return openpgp.decrypt(options).then(plaintext => {
    return plaintext.data;
  })

}

decrypt().then(console.log).catch(console.error);

