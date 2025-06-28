# Changelog

All notable changes to this project will be documented in this file.

The format is mainly based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## Changed

- Made the same Tailwind import change to the headless-ui library to see if this fixes the Tailwind v3 issue.

## [0.10.1-1] - 2025-06-28

## Changed

- Previous release caused an issue in a component library using Tailwind v3, so I've made a couple of changes to see if they fix the issue.

## [0.10.1-0] - 2025-06-27

## Changed

- Creating a test build to make sure everything still works.

## [0.10.0] - 2025-05-28

## Changed

- Fixed an issue in the formatted input where highlighted text would not be correctly identified if the mouse leaves the input while highlighting.
- Fixed an issue in the formatted input where typing once text has been highlighted wouldn't overwrite it correctly.
- Moved the headless components into their own library, so they can be used independently.

## [0.9.6] - 2025-05-21

## Changed

- Changed a couple of types to the proper wrapper type and prepared the final release.

## [0.9.6-4] - 2025-05-21

## Changed

- Fixes issues with the formatted input found during testing.

## [0.9.6-3] - 2025-05-20

## Changed

- Added date parameter as a dependency to the `useCallback` hooks in `useAddDateTimeBaseTemplateProps`.

## [0.9.6-2] - 2025-05-20

## Changed

- Moved `DateScrollerType` to a value export.

## [0.9.6-1] - 2025-05-20

## Changed

- Added the `DateScrollerType` to the exported types.

## [0.9.6-0] - 2025-05-20

## Added

- Added a feature to allow text to be highlighted and removed. Highlighting can be done with the mouse or certain key press operations.
- Added the ability to paste a value in the formatted input.

## [0.9.5] - 2024-10-05

## Changed

- Fixed an issue where theming the components wouldn't changed the colour of the focus ring.
- Also added an `onChange` placeholder for the headless field component; this is to stop warnings being thrown when the component is used in react hook form.

## [0.9.4] - 2024-07-20

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


[unreleased]: https://github.com/Beesoft-Collective/beesoft-components/compare/v0.10.1-1...develop
[0.10.1-1]: https://github.com/Beesoft-Collective/beesoft-components/releases/tag/v0.10.1-1
[0.10.1-0]: https://github.com/Beesoft-Collective/beesoft-components/releases/tag/v0.10.1-0
[0.10.0]: https://github.com/Beesoft-Collective/beesoft-components/releases/tag/v0.10.0
[0.9.6]: https://github.com/Beesoft-Collective/beesoft-components/releases/tag/v0.9.6
[0.9.6-4]: https://github.com/Beesoft-Collective/beesoft-components/releases/tag/v0.9.6-4
[0.9.6-3]: https://github.com/Beesoft-Collective/beesoft-components/releases/tag/v0.9.6-3
[0.9.6-2]: https://github.com/Beesoft-Collective/beesoft-components/releases/tag/v0.9.6-2
[0.9.6-1]: https://github.com/Beesoft-Collective/beesoft-components/releases/tag/v0.9.6-1
[0.9.6-0]: https://github.com/Beesoft-Collective/beesoft-components/releases/tag/v0.9.6-0
[0.9.5]: https://github.com/Beesoft-Collective/beesoft-components/releases/tag/v0.9.5
[0.9.4]: https://github.com/Beehive-Software-Consultants/beesoft-components/releases/tag/v0.9.4
[0.9.3]: https://github.com/Beehive-Software-Consultants/beesoft-components/releases/tag/v0.9.3
[0.9.2]: https://github.com/Beehive-Software-Consultants/beesoft-components/releases/tag/v0.9.2
[0.9.1]: https://github.com/Beehive-Software-Consultants/beesoft-components/releases/tag/v0.9.1
[0.9.0]: https://github.com/Beehive-Software-Consultants/beesoft-components/releases/tag/v0.9.0
[0.9.0-0]: https://github.com/Beehive-Software-Consultants/beesoft-components/releases/tag/v0.9.0-0
[0.8.0]: https://github.com/Beehive-Software-Consultants/beesoft-components/releases/tag/v0.8.0
