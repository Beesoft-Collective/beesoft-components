# Changelog

All notable changes to this project will be documented in this file.

The format is mainly based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## Changed

- Added a feature to cause the input to gain focus when the date icon is clicked.

## [0.9.3] - 2024-06-03

## Changed

- Added the `CheckboxChangeEvent` and `CheckboxRef` types back in.

## [0.9.2] - 2024-05-29

## Added

- Created the item scroller component; this will request new pages when the end of the currently loaded data is reached and make scrolling performant by only rendering a certain amount of pages at a single time.

## [0.9.1] - 2024-04-16

## Changed

- Changed where the onClick event is contained; this fixes the issue of custom icons not always triggering the selector.
- Added a new selector template for the date/time selector; this will allow custom markup to be added to the selector.
- Converted the checkbox component to a headless component; this is the first component that has been converted and includes the headless architecture.

## [0.9.0] - 2024-04-11

## Changed

- Released Official 0.9.0 version.

## [0.9.0-0] - 2024-04-11

## Added

- Created a new item scroller component.
- Exported the Group Button, Radio Button and Toggle components since they were not exported previously.

## Changed

- Upgraded to Storybook 8 and added the Chromatic plugin.

## [0.8.0] - 2024-03-29

### Added

- Created the new radio button component.
- Added advanced features to the button component.


[unreleased]: https://github.com/Beehive-Software-Consultants/beesoft-components/compare/v0.9.3...develop
[0.9.3]: https://github.com/Beehive-Software-Consultants/beesoft-components/releases/tag/v0.9.3
[0.9.2]: https://github.com/Beehive-Software-Consultants/beesoft-components/releases/tag/v0.9.2
[0.9.1]: https://github.com/Beehive-Software-Consultants/beesoft-components/releases/tag/v0.9.1
[0.9.0]: https://github.com/Beehive-Software-Consultants/beesoft-components/releases/tag/v0.9.0
[0.9.0-0]: https://github.com/Beehive-Software-Consultants/beesoft-components/releases/tag/v0.9.0-0
[0.8.0]: https://github.com/Beehive-Software-Consultants/beesoft-components/releases/tag/v0.8.0
