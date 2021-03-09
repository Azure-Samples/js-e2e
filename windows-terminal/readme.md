# Windows Terminal

## Set default terminal to bash

1. Right-click on Settings
1. In the `settings.json` file that opens, change the `defaultProfile` value to the bash Id.

## Set default directory

1. Right-click on Settings
1. In the `settings.json` file that opens, add a property to the profile item named `startingDirectory` with the new value.

  ```json
  "startingDirectory": "C:\\repos\\",
  ```
