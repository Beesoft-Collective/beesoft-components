import { Signal } from '@preact/signals-react';
import React, { HTMLInputTypeAttribute } from 'react';

/**
 * This is a basic wrapper around the different core pieces of a headless component.
 */
export interface HeadlessBaseProps<P, RP, SP = undefined> {
  /**
   * The id for the input type; this is used by the html for attribute.
   */
  id?: string;
  /**
   * The name of the input; this will be used by a form.
   */
  name?: string;
  /**
   * The backing field to create for the headless component.
   */
  type?: HTMLInputTypeAttribute;
  /**
   * The properties that need to be sent through the child render function to render the visual part of the component.
   */
  props: P;
  /**
   * The render properties that will be sent to the render function.
   */
  renderProps: RP;
  /**
   * The name (if needed) of the signal required by this component to retrieve data updates.
   */
  signalName?: string;
  /**
   * When the `signalName` is defined this will be called when the Signal object is received.
   * @param {Signal<SP extends undefined ? P : SP>} signal - The signal that belonged to the signal name.
   */
  onSignalRetrieved?: (signal: Signal<SP extends undefined ? P : SP>) => void;
  /**
   * The child render function called to render the visual part of the component.
   * @param {T} props - The properties to send through the render function.
   * @returns {React.JSX.Element} The JSX element to render.
   */
  children?: (props: RP) => React.JSX.Element;
  /**
   * Used to potentially add styling to the internal field component.
   */
  className?: string;
}
