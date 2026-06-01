# Security Policy

Cleat is a security product, so we hold our own code to the standard we ask of others. If you
find a vulnerability, we want to hear about it and we will work with you to fix it.

## Reporting a vulnerability

Please do not open a public issue, pull request, or discussion for security problems. Public
disclosure before a fix puts users at risk.

Instead, report it privately one of two ways:

- Use GitHub's private vulnerability reporting on this repository (the "Report a vulnerability"
  button under the Security tab). This is the preferred route.
- Or email **security@cleat.dev**. (Update this address to your real security contact.)

When you report, it helps to include:

- What the issue is and the kind of impact you think it has.
- Steps to reproduce it, or a small proof of concept.
- The area affected (for example the frontend, a specific dependency, or a config).
- Any suggested fix, if you have one in mind.

## What to expect

- We aim to acknowledge your report within three business days.
- We will keep you posted as we investigate and work on a fix.
- Once a fix ships, we are glad to credit you, unless you would rather stay anonymous.

## Scope

This repository currently contains the frontend, which runs on dummy data and makes no real API
calls. As the Java and Spring Boot backend, GitHub App integration, and authentication land, this
policy will grow to cover them. Reports about dependencies used in the build are welcome too.

## Please avoid

- Accessing or modifying data that is not yours.
- Degrading the service for others (for example denial-of-service testing).
- Any social engineering of the team or our users.

Good-faith research that follows this policy is welcome, and we will not pursue action against it.
