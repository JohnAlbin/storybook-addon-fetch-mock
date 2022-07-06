# Developer guide

## Semantic Commit Messages

The `storybook-addon-fetch-mock` project uses semantic commit messages. A minor change to your commit message style can:

- make you a better programmer
- helps to automate the [CHANGELOG](CHANGELOG.md) generated for other developers

Don’t worry. You can still submit a Pull Request and if you don’t properly use semantic commit messages, we will edit the commits to add them. But we like them, so you might too.

### Commit message format:

```
<type><!>: <subject>

<body>
```

`<!>` is optional. It must be used for a BREAKING CHANGE.

`<body>` is optional. If the exclamation mark is added before the `<subject>`, the `<body>` must use the format `BREAKING CHANGE: <body>`.

### Details

```
+---→ <type>: Must be one of:
│             feat, fix, style, refactor,
│             docs, style, test, chore
│             Append with ! if its a BREAKING CHANGE.
│
│  (<scope>): Semantic commit messages can contain an
│             optional "(scope)" after the "type", but
│             this project doesn't use them.
│
│   +--→ <!>: Indicates a BREAKING CHANGE that
│   │         requires a new major semantic version.
│   │         Can be part of commits of any `type`.
│   │
│   │  +--→ <subject>: The commit summary in present
│   │  │               tense. Starts with a capital
│   │  │               letter. Doesn't end in a
│   │  │               period.
⎡‾‾⎤⎡⎤ ⎡‾‾‾‾‾‾‾‾‾‾‾‾⎤

feat!: Add hat wobble

BREAKING CHANGE: Added the "wobble" option,
using the hattip module as a dependency.
Requires Node.js v18 or later. Fixes #3

⎣⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎦
│
│
+----→ <body>: A longer version of the commit summary.
               Can contain multiple paragraphs.
               If the commit relates to a Github issue,
               the body MUST include a reference to the
               issue number, e.g. "Issue #2" or
               "Fixes #2". If the commit is a breaking
               change, the body MUST use the format
               "BREAKING CHANGE: <description>".
```

### Examples of `<type>`:

The `<type>` part of the commit message MUST be one of the following:

- `feat`: **new feature** for the user, not a new feature for a build script
- `fix`: **bug fix** for the user, not a fix to a build script
- `style`: **code formatting** like missing semicolons, etc.; no production code change
- `refactor`: **refactoring production code** like renaming a variable
- `docs`: **documentation** changes
- `test`: **test suite changes** like adding missing tests, refactoring tests; no production code change
- `chore`: **misc changes** like tooling changes (updating grunt tasks), etc.; no production code change

**Important Note:** A single commit can only use one `<type>`, which means if a commit covers multiple `types`, it must be refactored into multiple atomic commits.

## References:

### Semantic commit messages:

- https://www.conventionalcommits.org/
- https://seesparkbox.com/foundry/semantic_commit_messages
- http://karma-runner.github.io/1.0/dev/git-commit-msg.html
