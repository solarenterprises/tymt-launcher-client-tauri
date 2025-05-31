# Security Technical Debt

## CSP Exceptions

- `unsafe-eval`: Required by @solar-network/crypto's ajv dependency
  - Timeline: Remove by 2025-06-30
  - Solution: Migrate to ajv@7+ or alternative validator
- `unsafe-inline`: Required by MUI components
  - Timeline: Remove by 2025-06-30
  - Solution: Implement CSP nonces or style hashes
