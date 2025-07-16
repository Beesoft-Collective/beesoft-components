// components
import { BeeSoftProvider } from './common/contexts/beesoft.context.tsx';
import {
  SelectionLabelLocation,
  FormGroupItemOrientation,
  GroupChangeEvent,
} from './components/form/form-generic.interfaces.ts';
import { Button } from './components/navigation/buttons/button/button.component.tsx';
import { Checkbox } from './components/form/checkboxes/checkbox/checkbox.component.tsx';
import { CheckboxGroup } from './components/form/checkboxes/checkbox-group/checkbox-group.component.tsx';
import ContentEditableInput from './components/form/inputs/content-editable-input/content-editable-input.component';
import { DateTime } from './components/form/date-time/date-time.component';
import FormattedInput from './components/form/inputs/formatted-input/formatted-input.component';
import { GroupButton } from './components/form/buttons/group-button/group-button.component.tsx';
import { MediaQuery } from './components/mobile/media-query/media-query.component.tsx';
import { MobileOverlayPanel } from './components/mobile/overlay/mobile-overlay-panel.component.tsx';
import OverlayPanel from './components/overlay/overlay-panel/overlay-panel.component';
import { RadioButton } from './components/form/radio-buttons/radio-button-old/radio-button.component.tsx';
import { Toggle } from './components/form/checkboxes/toggle/toggle.component.tsx';

// functions
import { createBeeSoftTheme, applyBeeSoftTheme } from './components/common-functions';

// types
import { CheckboxChangeEvent } from './components/form/checkboxes/checkbox/checkbox.props.ts';
import { CheckboxRef } from './components/form/checkboxes/checkbox/checkbox.props.ts';
import {
  DateFormatType,
  DateScrollerType,
  DateSelectionType,
  DateSelectorType,
} from './components/form/date-time/date-time-types';
import {
  DateTimeCalendarTemplateProps,
  DateTimeInputTemplateProps,
  DateTimeScrollerTemplateProps,
} from './components/form/date-time/date-time.props.ts';
import { GroupButtonItemTemplateProps } from './components/form/buttons/group-button/group-button.props.ts';
import { RadioChangeEvent } from './components/form/radio-buttons/radio-button/radio-button.props.ts';

// styles
import '../node_modules/@beesoft/headless-ui/dist/headless-ui.css';
import './index.css';

export {
  BeeSoftProvider,
  Button,
  Checkbox,
  CheckboxGroup,
  ContentEditableInput,
  DateTime,
  FormattedInput,
  GroupButton,
  MediaQuery,
  MobileOverlayPanel,
  OverlayPanel,
  RadioButton,
  Toggle,

  // functions
  applyBeeSoftTheme,
  createBeeSoftTheme,

  // types to be used as values
  DateFormatType,
  DateScrollerType,
  DateSelectionType,
  FormGroupItemOrientation,
  SelectionLabelLocation,
};

export type {
  CheckboxChangeEvent,
  CheckboxRef,
  DateSelectorType,
  DateTimeInputTemplateProps,
  DateTimeScrollerTemplateProps,
  DateTimeCalendarTemplateProps,
  GroupButtonItemTemplateProps,
  GroupChangeEvent,
  RadioChangeEvent,
};
