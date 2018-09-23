# backbox-test

Test for [blackbox](https://github.com/StackExchange/blackbox) and []KeybasePGP](https://keybase.io/kbpgp)

1. Create GPG KeyPair

2. Export with
```bash
gpg --list-secret-keys --fingerprint helix
gpg --export-secret-keys -a ECAA07B9AA445682477C0EF4A0DB169C4522D9B9 > privkey.asc

```

## Test with Keybase PGP

see https://keybase.io/kbpgp

```
$ time node index.js
Loaded private key w/o passphrase
decrypted message
hello test
this is a change
and another change

real	0m1.250s
user	0m0.737s
sys	0m0.083s
```

## Test with OpenPGPJS

see https://github.com/openpgpjs/openpgpjs/

```
$ time node opepgp.js
hello test
this is a change
and another change


real	0m0.728s
user	0m0.723s
sys	0m0.035s
```

