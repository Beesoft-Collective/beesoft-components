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
| **readOnly** | `boolean` | Allows the component to have a value set but not allow it to be modified. |
| **label** | `string` | Sets the label for the component. |
| **useDefaultDateValue** | `boolean` | If set to true then the current date will be populated in the selection box. |
| **locale** | `string` | Allows the locale settings to be overridden, if this is not set then the users locale settings will be used. |
| **dateSelection** | `DateSelectionType` | Allows the component to be set in 4 modes DateTime, Date Only, Time Only and Date Range (`default Date/Time`). |
| **dateFormat** | `DateFormatType` | Allows for the date to be formatted in short, medium or long formats. |
| **timeConstraints** | `TimeConstraints` | Allows the time selection component to determine how the increment/decrement the values (currently only minute works). |
| **icon** | `JSX.Element` | This can be used to change the calendar icon. |
| **iconPosition** | `CalendarIconPosition` | Determines if the calendar icon appears on the right or the left. |
| **inputElement** | `HTMLElement` | When a custom input template is used this gives the component the HTMLElement to use for calendar positioning. |
| **selectableDate** | `(currentDate: Date) => boolean` | Determines if a date is allowed to be selected...if false is returned then the date will be disabled. |
| **isValidDate** | `(selectedDate: Date) => boolean` | Determines if the passed date is a valid selectable date...if false is returned then the selection isn't made. |
| **onChange** | `(value: Date) => void` | Returns the value selected by the user (even though this optional it is recommended to be set). |
| **calendarTemplate** | `DateTimeCalendarTemplate` | Allows the calendar UI to be overridden or added to. |
| **dateScrollerTemplate** | `DateTimeScrollerTemplate` | Allows the scroller UI to be overridden or added to. |
| **inputTemplate** | `DateTimeInputTemplate` | Allows for a different input and label to be used for the component. |

### Templating

Templating allows for certain pieces of the component to be replaced with your own markup; currently the calendar, the scroller and the input/label can be replaced with your own markup. Below is an example of how to create a template function that can be passed into one of the template properties.

```javascript
const inputTemplate = (props: DateTimeInputTemplateProps, children: React.ReactNode | React.ReactNodeArray) => (
    <div className="custom-css-classes">{children}</div>
);
```

The `children` parameter is passed in the case where you want to wrap the current markup with your own additions. If not you can just provide your own custom markup using the properties from the `props` parameter. If you provide your own markup you will need to pass in the html element you are using to the `inputElement` property, so the calendar will know where to show and when to hide itself.

#### Calendar Template Properties

These are the properties passed to the calendar template.

| Name        | Required | Type       | Description |
| ----------- | -------- | ---------- | ----------- |
| **viewDate** | **true** | `Date` | The current date being viewed in the calendar; this is not the selected date it is the date that is being used to render the current calendar month(s). |
| **selectedDate** | **false** | `Date` | The current date selected by the user or the initial value passed to the component. |
| **selectedStartDate** | **false** | `Date` | The current start date of a date range selection this is only set when the component is in date range mode. |
| **selectedEndDate** | **false** | `Date` | The current end date of a date range selection this is only set when the component is in date range mode. |
| **selectionMode** | **false** | `CalendarSelectionMode` | Contains the values `Normal` and `Range`; selected range puts the calendar into range selection mode. |
| **locale** | **false** | `Locale` | The Locale object comes from the date-fns library and contains information about the users locale date settings. |
| **onDateSelected** | **false** | `function(date: Date, options?: Record<string, any>) => void` | Used to tell the component when a date has been selected. |
| **selectableDate** | **false** | `function(currentDate: Date) => boolean` | Determines if a date is allowed to be selected...if false is returned then the date will be disabled. |
| **isValidDate** | **false** | `function(selectedDate: Date) => boolean` | Determines if the passed date is a valid selectable date...if false is returned then the selection isn't made. |
| **dispatcher** | **false** | `React.Dispatch<DateTimeReducerAction>` | Used to set values within the component like the selected and current view date. |

#### Input Template Properties

These are the properties passed to the input template.

| Name        | Required | Type       | Description |
| ----------- | -------- | ---------- | ----------- |
| **label** | **false** | `string` | The label to display for the input; if undefined then no label is set. |
| **readOnly** | **true** | `boolean` | Determines if the input should be read only or not. |
| **getValue** | **true** | `function() => string` | Returns the currently selected value(s) as a string to be displayed. |
| **onFocus** | **true** | `function(event: React.FocusEvent) => void` | Should be assigned to the input component so it will be called when it's focused. |
| **onInput** | **true** | `function(event: React.FormEvent) => void` | Should be assigned to the input component so it will be called when the user types into the input. |
| **iconPosition** | **true** | `CalendarIconPosition` | Determines if the icon is supposed to be on the right or left. |
| **iconElement** | **false** | `JSX.Element` | The icon that is supposed to be clicked to show the calendar. |
| **iconElementClassName** | **false** | `string` | The classes to use for the icon element wrapper. |
| **onElementClick** | **false** | `function(event: React.MouseEvent) => void` | The function to call when the icon element is clicked. |

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
