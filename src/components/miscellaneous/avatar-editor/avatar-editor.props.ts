export interface AvatarEditorProps {
  /**
   * The visible width of the display area; this will be used to resize the loaded image to a viewable size. If width is
   * set do not set the height.
   */
  width?: number
  /**
   * The visible height of the display area; this will be used to resize the loaded image to a viewable size. If height
   * is set do not set the width.
   */
  height?: number;
  /**
   * The text to display when no file is loaded.
   */
  label: string;
  /**
   * The base64 encoded image to show in the editor.
   */
  source?: string;
  /**
   * The default size of the crop radius circle.
   */
  cropRadius?: number;
  /**
   * The color of the crop circle and adjustment icon (default gray).
   */
  cropColor?: string;
  /**
   * The color of the close/remove icon (default gray).
   */
  closeColor?: string;
  /**
   * The color of the non-cropped part of the image (default gray).
   */
  shadingColor?: string;
  /**
   * The opacity level applied to the shader (default 0.4).
   */
  shadingOpacity?: number;
  /**
   * Event fired when an edit operation is performed.
   * @param data {string} - The resulting image as a Base64 string.
   */
  onEdit?: (data?: string) => void;
  /**
   * Event fired when the loaded image is removed.
   */
  onRemove?: () => void;
}
