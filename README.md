<h1 align="center">FlutterMatic</h1>

<p align="center">Flutter Matic is a one click flutter installer!
<br>
<br>
<img align="center" width="120px" height="120px" src="./media/extension_logo.png" alt="FlutterMatic Logo" />
</p>


## Installation

Use the [VSCode Marketplace link](https://marketplace.visualstudio.com/items?itemName=FlutterMatic.flutter-matic) (direct) 

If that does not work, or you are running a version of VSCode that does not include the Marketplace, follow these instructions
- Open VSCode's Quick Open (<kbd>Ctrl+P</kbd>)
- Run this command: `ext install FlutterMatic.flutter-matic`

### Building from source
> You need to have `node` and `npm` on your `$PATH`
- Clone this repo `git clone https://github.com/FlutterMatic/FlutterMatic` and change directory `cd` into it.
- Install all required dependencies `yarn`
- Open VSCode in this directory `code .`
- Once VSCode is open, press <kbd>F5</kbd> ; This will launch a new VSCode Extension Development window. 
- Use the extension in the new window


## Features

The current feature set includes:

### Installation of Flutter 
- Download Flutter SDK (Beta) from the official github repository
- Install Flutter SDK using `flutter`
- Set the `$PATH` variable in supported shell(s)

### Creation of new Flutter Web Project
- Create a new flutter web project using `flutter create <project-name>`
- Open VSCode in the new directory

## Compatibility

### Shell Compatibility
Right now, supported shells for `$PATH` setting include,
- FISH 
- ZSH
- BASH (written to `~/.bash_profile` in MacOS)

Windows implementation is still being tested. Please file a issue if the `$PATH` is not set properly


## Contributing
- Please format the code
- Lint your code `yarn lint` and `yarn lint --fix`
- Create a PR 
- Feel free to discuss a feature request in the issues first


**Love FlutterMatic ?** Give the repo a star 🌟

**Found a bug ?** File a issue here 🐛

**Have a fix** ? Make a Pull Request 👥
