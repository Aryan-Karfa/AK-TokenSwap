# Security Policy

## Responsible Disclosure

We take security seriously. If you discover a vulnerability in StellarSwap, please report it to us privately by emailing [security@stellarswap.app](mailto:security@stellarswap.app). Do not open a public GitHub issue for security disclosures.

## Key Management Guidelines

StellarSwap is a decentralized interface. 
* **Never** enter your private key (seed phrase) directly into the UI.
* StellarSwap only interacts with the ledger via Freighter Wallet.
* Freighter handles signing securely inside its browser sandbox.
* Always check the destination address and swap parameters in Freighter before signing transaction XDR payloads.
