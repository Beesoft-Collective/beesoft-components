# BeeSoft Components

A library of components for the React framework styled using tailwind css. This library is currently a beta so please report any issues found or make suggestions.

#### `Install`
> npm install beesoft-components

or

> yarn add beesoft-components

## Date/Time Component

_**Upgrade Warning**_\
_Starting with version 0.2.0 there are breaking changes with the current template options being removed and only calendar and scroller templates available._

This is the main component in the library currently; it has the ability to select not only a date but also time. Below are the current component properties (currently all of them are optional).

| Name        | Type       | Description |
| ----------- | ---------- | ----------- |
| **value** | `string, Date or Date[]` | Sets the value of the component can either be a date object or a string in a local or ISO format. |
| **label** | `string` | Sets the label for the component. |
| **useDefaultDateValue** | `boolean` | If set to true then the current date will be populated in the selection box. |
| **locale** | `string` | Allows the locale settings to be overridden, if this is not set then the users locale settings will be used. |
| **dateSelection** | `DateSelectionType` | Allows the component to be set in 4 modes DateTime, Date Only, Time Only and Date Range (`default Date/Time`). |
| **dateFormat** | `DateFormatType` | Allows for the date to be formatted in short, medium or long formats. |
| **timeConstraints** | `TimeConstraints` | Allows the time selection component to determine how the increment/decrement the values (currently only minute works). |
| **iconPosition** | `CalendarIconPosition` | Determines if the calendar icon appears on the right or the left. |
| **selectableDate** | `function (currentDate: Date) => boolean` | Determines if a date is allowed to be selected...if false is returned then the date will be disabled. |
| **isValidDate** | `function (selectedDate: Date) => boolean` | Determines if the passed date is a valid selectable date...if false is returned then the selection isn't made. |
| **onChange** | `function (value: Date) => void` | Returns the value selected by the user (even though this optional it is recommended to be set). |
| **calendarTemplate** | `DateTimeCalendarTemplate` | Allows the calendar UI to be overridden or added to. |
| **dateScrollerTemplate** | `DateTimeScrollerTemplate` | Allows the scroller UI to be overridden or added to. |

### Dark Mode

Dark mode is a common feature for many web applications. Beehive components support dark mode, to turn it on add a `dark` class to the body tag. In React you can use to following line:

> document.body.className = 'dark';

### Date Range

The component now has a date range mode; this can be used by setting the `dateSelection` property to `DateRange`. To select a range start by making an initial selection then hold `shift` and click the next date to select the whole range. Once a selection is made clicking `shift` and selecting another date will change the range selection.

### Styling Options

To allow for more customizing CSS placeholder classes have been added to the component; below is an example of the available classes using scss.

```scss
.bc-date-time {
  .bc-dt-label {
    // the styles for the component label
  }
  .bc-dt-input {
    // the styles for the input containing the date string
  }
  .bc-dt-day-selector {
    .bc-dt-scroller {
      .bc-dt-scroller-left {
        // the styles for the left arrow section of the scroller
      }
      .bc-dt-scroller-title {
        // the styles for the scroller title
      }
      .bc-dt-scroller-right {
        // the styles for the right arrow section of the scroller
      }
    }
    .bc-dt-calendar {
      .bc-dt-day-row {
        .bc-dt-day-cell {
          // these are the cells for the days like (e.g. Mon, Tue)
        }
        .bc-dt-date-cell {
          // these are the cells for the actual date values (e.g. 1, 2, 3)
        }
      }
    }
    .bc-dt-time-value-wrapper {
      .bc-dt-time-value {
        // the styles for the actual time text value
      }
    }
  }
  .bc-dt-month-selector {
    .bc-dt-scroller {
      .bc-dt-scroller-left {
        // the styles for the left arrow section of the scroller
      }
      .bc-dt-scroller-title {
        // the styles for the scroller title
      }
      .bc-dt-scroller-right {
        // the styles for the right arrow section of the scroller
      }
    }
    .bc-dt-month-grid {
      .bc-dt-month-cell {
        // the styles for the month values
      }
    }
  }
  .bc-dt-year-selector {
    .bc-dt-scroller {
      .bc-dt-scroller-left {
        // the styles for the left arrow section of the scroller
      }
      .bc-dt-scroller-title {
        // the styles for the scroller title
      }
      .bc-dt-scroller-right {
        // the styles for the right arrow section of the scroller
      }
    }
    .bc-dt-year-wrapper {
      .bc-dt-year-grid {
        .bc-dt-year-cell {
          // the styles for the year values
        }
      }
    }
  }
  .bc-dt-time-selector {
    .bc-dt-time-grid {
      .bc-dt-time-date-value {
        // the styles for the day value in the time selector
      }
      .bc-dt-time-hour-increase {
        // the styles for the hour increase button
      }
      .bc-dt-time-minute-increase {
        // the styles for the minute increase button
      }
      .bc-dt-time-meridian-increase {
        // the styles for the meridian increase button
      }
      .bc-dt-time-hour-value {
        // the styles for the hour value
      }
      .bc-dt-time-separator {
        // the styles for the time separator
      }
      .bc-dt-time-minute-value {
        // the styles for the minute value
      }
      .bc-dt-time-meridian-value {
        // the styles for the meridian values
      }
      .bc-dt-time-hour-decrease {
        // the styles for the hour decrease button
      }
      .bc-dt-time-minute-decrease {
        // the styles for the minute decrease button
      }
      .bc-dt-time-meridian-decrease {
        // the styles for the meridian decrease button
      }
    }
  }
  .bc-dt-range-selector {
    .bc-dt-range-scroller-wrapper {
      .bc-dt-scroller {
        .bc-dt-scroller-left {
          // the styles for the left arrow section of the scroller
        }
        .bc-dt-scroller-title {
          // the styles for the scroller title
        }
        .bc-dt-scroller-right {
          // the styles for the right arrow section of the scroller
        }
      }
    }
    .bc-dt-range-wrapper {
      .bc-dt-range-calendar-1 {
        .bc-dt-calendar {
          .bc-dt-day-row {
            .bc-dt-day-cell {
              // these are the cells for the days like (e.g. Mon, Tue)
            }
            .bc-dt-date-cell {
              // these are the cells for the actual date values (e.g. 1, 2, 3)
            }
          }
        }
      }
      .bc-dt-range-calendar-2 {
        .bc-dt-calendar {
          .bc-dt-day-row {
            .bc-dt-day-cell {
              // these are the cells for the days like (e.g. Mon, Tue)
            }
            .bc-dt-date-cell {
              // these are the cells for the actual date values (e.g. 1, 2, 3)
            }
          }
        }
      }
    }
  }
}
```
