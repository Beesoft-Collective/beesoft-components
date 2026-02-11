# Changelog

All notable changes to this project will be documented in this file.

The format is mainly based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## Changed

- Fixed a preview image recalculation issue when loading a second image.

## [0.12.2] - 2026-02-09

## Changed

- Moved the code that generates the preview on file load into the loading function to try and fix a minor issue.

## [0.12.1] - 2026-01-20

## Changed

- Attempting to get the avatar component to work with non-local Uri's.

## [0.12.0] - 2026-01-19

## Added

- Finalised the basic features of the avatar editor.

## [0.12.0-0] - 2026-01-16

## Added

- Created an avatar editor component; this is a simple version that will need to be completed later.

## [0.11.0] - 2026-01-14

## Changed

- Upgraded to React 19 and removed the old react transition group library.

## [0.10.5] - 2025-12-02

## Changed

- Added the new `onError` event to the date component and call it when the manual date entry is invalid.

## [0.10.4] - 2025-09-15

## Changed

- Moved the locale code into a separate library.

## [0.10.3] - 2025-09-10

## Changed

- Updated the checkbox group to use the new headless checkbox group instead of implementing the logic itself.

## [0.10.2] - 2025-07-27

## Changed

- Updated the radio button to use the new headless radio group component.
- Updated the toggle to use the new headless toggle component.

## [0.10.1] - 2025-07-05

## Changed

- Upgraded the majority of the library's dependencies most notably Tailwind to version 4. This brings better styling capabilities to the components.

## [0.10.1-8] - 2025-07-05

## Changed

- Added the important flag to the hover button styles, this is to allow these styles to override Tailwind 3's preflight button styles.

## [0.10.1-7] - 2025-07-03

## Changed

- Added a missing style to the year selector.

## [0.10.1-6] - 2025-06-30

## Changed

- Added some missed styles.

## [0.10.1-5] - 2025-06-30

## Changed

- Setting the important flag on a couple of classes; this should fix a styling issue when the library is implemented in a project still using Tailwind 3.

## [0.10.1-4] - 2025-06-28

## Changed

- Fixed a couple of styling issues found while testing in another library.

## [0.10.1-3] - 2025-06-28

## Changed

- Forgot to change the name of the components layer to bsc-components.

## [0.10.1-2] - 2025-06-28

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


[unreleased]: https://github.com/Beesoft-Collective/beesoft-components/compare/v0.12.2...develop
[0.12.2]: https://github.com/Beesoft-Collective/beesoft-components/releases/tag/v0.12.2
[0.12.1]: https://github.com/Beesoft-Collective/beesoft-components/releases/tag/v0.12.1
[0.12.0]: https://github.com/Beesoft-Collective/beesoft-components/releases/tag/v0.12.0
[0.12.0]: https://github.com/Beesoft-Collective/beesoft-components/releases/tag/v0.12.0
[0.12.0-0]: https://github.com/Beesoft-Collective/beesoft-components/releases/tag/v0.12.0-0
[0.11.0]: https://github.com/Beesoft-Collective/beesoft-components/releases/tag/v0.11.0
[0.10.5]: https://github.com/Beesoft-Collective/beesoft-components/releases/tag/v0.10.5
[0.10.4]: https://github.com/Beesoft-Collective/beesoft-components/releases/tag/v0.10.4
[0.10.3]: https://github.com/Beesoft-Collective/beesoft-components/releases/tag/v0.10.3
[0.10.2]: https://github.com/Beesoft-Collective/beesoft-components/releases/tag/v0.10.2
[0.10.1]: https://github.com/Beesoft-Collective/beesoft-components/releases/tag/v0.10.1
[0.10.1-8]: https://github.com/Beesoft-Collective/beesoft-components/releases/tag/v0.10.1-8
[0.10.1-7]: https://github.com/Beesoft-Collective/beesoft-components/releases/tag/v0.10.1-7
[0.10.1-6]: https://github.com/Beesoft-Collective/beesoft-components/releases/tag/v0.10.1-6
[0.10.1-5]: https://github.com/Beesoft-Collective/beesoft-components/releases/tag/v0.10.1-5
[0.10.1-4]: https://github.com/Beesoft-Collective/beesoft-components/releases/tag/v0.10.1-4
[0.10.1-3]: https://github.com/Beesoft-Collective/beesoft-components/releases/tag/v0.10.1-3
[0.10.1-2]: https://github.com/Beesoft-Collective/beesoft-components/releases/tag/v0.10.1-2
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
