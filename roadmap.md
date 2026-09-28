# Roadmap

- [x] Generic profile for any user; no hardcoded people or demo messages
- [x] Photo upload in Edit Profile + neutral placeholder
- [x] Empty message state ("No messages preserved yet." + CTA)
- [ ] Fix verification flow:
  - [x] Required "Author email" field on Preserve form (+ helper copy)
  - [~] "Ask author to verify" sends email with unique token link, no owner redirect
  - [x] Confirmation toast/notice to owner
  - [x] Verification page keyed by token, author-facing copy, approve/don't recognize/decline
  - [x] Verified status reflected on dashboard + public profile
  - [x] Author email never shown publicly

- [ ] BLOCKED: actually sending the verification email needs the owner's own sender domain (email setup)
