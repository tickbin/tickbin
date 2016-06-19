
## Building

To build the application:

    npm install
    npm run build
    ./build/tick --help #you could create an alias in your .bashrc

## Testing

Pull requests will not be merged in if tests do not pass. We use sempaphore as
hosted CI tool, but you can run your tests locally too

    npm test

Please ensure that you test your code well using the style in the existing
tests.

## Making a pull request

Please be descriptive in your PR descriptions and ensure that only one feature
or fix is included in a PR. Use the [conventional changelog](https://github.com/conventional-changelog/standard-version#commit-message-convention-at-a-glance)
standard for your pull request title and description.

_patches:_

    "fix(parsing): fixed a bug in our parser"

_features:_

    "feat(parser): we now have a parser \o/"

_breaking changes:_

    "feat(new-parser): introduces a new parsing library
    BREAKING CHANGE: new library does not support foo-construct"

_other changes:_

You decide, e.g., docs, chore, etc.

    "docs: fixed up the docs a bit"
    "chore(package): update dependencies"

For a more detailed description of changelog conventions see
https://github.com/bcoe/conventional-changelog-standard/blob/master/convention.md

## Releasing

Core developers will handle cutting and publishing of releases (which we will
eventually automate). To do a release:

    npm run release
    npm push <upstream> master --tags
    npm publish

This will update the CHANGELOG with changes and set the correct version
