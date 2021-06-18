# BeeSoft Components

A library of components for the React framework styled using tailwind css. This library is currently a beta so please report any issues found or make suggestions.

#### `Install`
> npm install beesoft-components

or

> yarn add beesoft-components

## Date/Time Component

This is the main component in the library currently; it has the ability to select not only a date but also time. Below are the current component properties (currently all of them are optional). 

| Name        | Type       | Description |
| ----------- | ---------- | ----------- |
| **value** | `string or Date` | Sets the value of the component can either be a date object or a string in a local or ISO format. |
| **label** | `string` | Sets the label for the component. |
| **useDefaultDateValue** | `boolean` | If set to true then the current date will be populated in the selection box. |
| **locale** | `string` | Allows the locale settings to be overridden, if this is not set then the users locale settings will be used. |
| **dateSelection** | `DateSelectionType` | Allows the component to be set in 3 modes Date/Time, Date Only and Time Only (`default Date/Time`). |
| **dateFormat** | `DateFormatType` | Allows for the date to be formatted in short, medium or long formats. |
| **timeConstraints** | `TimeConstraints` | Allows the time selection component to determine how the increment/decrement the values (currently only minute works). |
| **onChange** | `function (value: Date)` | Returns the value selected by the user (even though this optional it is recommended to be set). |
| **daySelectorTemplate** | `DaySelectorTemplate` | Allows the day selector UI to be overridden or added to. |
| **monthSelectorTemplate** | `MonthSelectorTemplate` | Allows the month selector UI to be overridden or added to. |
| **yearSelectorTemplate** | `YearSelectorTemplate` | Allows the year selector UI to be overridden or added to. |
| **timeSelectorTemplate** | `TimeSelectorTemplate` | Allows the time selector UI to be overridden or added to. |

### Dark Mode

Dark mode is a common feature for many web applications. Beehive components support dark mode, to turn it on add a `dark` class to the body tag. In React you can use to following line:

> document.body.className = 'dark';
