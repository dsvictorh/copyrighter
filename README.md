# USP Copyrighter
- [Installation & Configuration](#installation-configuration-its-super-complicated-only-smarts-peoples)
- [Commands](#commands)
- [Using Arguments](#using-arguments)
- [Argument List](#argument-list)
- [Test Specific Files](#test-specific-files)
- [New Version Process](#new-version-process)

### Installation & Configuration (It's Super Complicated. Only Smarts Peoples)
```console
npm install
```
### Commands
* **build**: Builds the typescript files into the dist folder.
* **start**: Builds the typescript files into the dist folder and runs it.
* **test**: Builds the typescript files into the dist-tests folder and runs the tests.
* **test:silent**: Builds the typescript files into the dist-tests folder and runs the tests ignoring the application's console outputs.

### Using Arguments
When using npm run start in order to add arguments they need to be prefixed by "--"
```console
npm run start -- -f ./some-folder -r --tommy
```
#### Argument List
More information on every argument on *index.ts* or by using the *--help* argument.

* **--help -h**: Show help.
* **--version -v**: Show version number.
* **--answer -a**: Set the automatic answer value for user prompts (Y/n). This can be used for build pipelines to automatically answer confirmation prompts that would block the job. Non valid answer values will cancel the entire operation.
* **--config -c**: Extra configuration JSON file to modify or replace Copyrighter's configurations. If any of the top level properties are omitted the default configuration will fill it in.
* **--encoding -e**: Encoding to read and write files with.
* **--exclude-directories -x**: Directories to be excluded from the process.
* **--folder -f**: Root folder from where to start the process.
* **--file-types -t**: File types that you want to copyright.
* **--log-mode -l**: Copyright errors will be logged without causing the tool to finish with an error code.
* **--remove -r**: Remove the copyright text instead of adding/replacing it.
* **--scan -s**: Run the tool in scan mode.
* **--year -y**: Set the year used by the tool. If not specified the tool will take any copyright text regardless of year as valid in scan mode and use the current year for the replacement text in replace mode.

### Test Specific Files
* **Tests Folder**: Add all test files there.
* **Mock Files**: Mock interface implementations for unit testing.
* **tsconfig.test.json**: Override of *tsconfig.json* to include test files and ignore non mock injectable classes.
* **copyrighter.test.json**: Override of *copyrighter.json* for custom configuration tests only.

### New Version Process
* Change *package.json* version number.
* Change *index.ts* version number on yargs configuration.
* Delete *package-lock.json* file and *npm install* to generate a new lock.
* Merge to master and create new version tag with release notes on git repository.
* Build project and commit contents to deployment repo master branch.
* Replace version number on installation section on README file on deployment repo.
* Add or remove help parameters on the argument list section on README file on deployment repo.
* Replace Default Configuration with latest contents of *copyrighter.json* on README file on deployment repo.
* Create new version tag with release notes on deployment repo.