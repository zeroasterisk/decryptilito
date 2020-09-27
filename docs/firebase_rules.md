Using firebase + firestore.

[Docs](https://firebase.google.com/docs/firestore/)

[Docs on rules](https://firebase.google.com/docs/firestore/security/overview)

[Walkthrough on using the emulator]()

## How to run the emulator and test rules locally

Change directory into the git repo root.

```sh
# start emulator
$ firebase emulators:start --only firestore,functions
# go into the functions directly
$ cd functions
# ensure all npm packages are there
$ npm i
# run tests
$ npm test
```

Want to do active TDD development?

```sh
# watch for file changes...
$ npx mocha ./tests -w
```

## Deploy Rules

You can just [copy and paste via console](https://firebase.corp.google.com/u/0/project/decryptilito2/firestore/rules) or you can deploy rules files via the CLI.

TODO(alan): update with CLI
