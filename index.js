const kbpgp = require('kbpgp');
const fs = require('fs');

const alice_pgp_key    = fs.readFileSync('privkey.asc', 'utf-8');
var alice_passphrase = "";

async function load() {
  return new Promise((resolve, reject) => {
    kbpgp.KeyManager.import_from_armored_pgp({
      armored: alice_pgp_key
    }, function(err, alice) {
      if (!err) {
        if (alice.is_pgp_locked()) {
          alice.unlock_pgp({
            passphrase: alice_passphrase
          }, function(err) {
            if (!err) {
              console.log("Loaded private key with passphrase");
              resolve(alice);
            }
          });
        } else {
          console.log("Loaded private key w/o passphrase");
          resolve(alice);
        }
      }
      reject(err);
    });
  });
}

async function getKeyRing(...kms) {
  var ring = new kbpgp.keyring.KeyRing();
  for (var i in kms) {
    ring.add_key_manager(kms[i]);
  }
  return ring;
}

async function decrypt(ring, pgp_msg, asp) {
  return new Promise((resolve, reject) => {
    kbpgp.unbox({keyfetch: ring, raw: pgp_msg }, function(err, literals) {
      if (err != null) {
        console.log("Problem: " + err);
        reject(err);
      } else {
        console.log("decrypted message");
        console.log(literals[0].toString());
        var ds = km = null;
        ds = literals[0].get_data_signer();
        if (ds) { km = ds.get_key_manager(); }
        if (km) {
          console.log("Signed by PGP fingerprint");
          console.log(km.get_pgp_fingerprint().toString('hex'));
        }
        resolve();
      }
    });
  });
}

async function run() {
  const keymgr = await load();
  const ring = await getKeyRing(keymgr);
  var pgp_msg = fs.readFileSync('secret.txt.gpg');
  return decrypt(ring, pgp_msg, null);
}

run().then(console.log).catch(console.error);
