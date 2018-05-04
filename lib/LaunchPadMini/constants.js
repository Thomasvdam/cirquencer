/**
 * Dimensions of the grid. Single value as it is a square.
 */
export const GRID_SIZE = 8;

/**
 * The value that is sent when a pad is pressed.
 */
export const PAD_PRESSED_VALUE = 127;

/**
 * All the top row button MIDI codes start with this number.
 */
export const TOP_ROW_CODE = 176;

/**
 * The MIDI codes for all buttons and pads apart from the very top row start with this number.
 */
export const GRID_SIDE_CODE = 144;

/**
 * This MIDI command will turn all lights on the LaunchPad off.
 */
export const RESET_MIDI_COMMAND = [176, 0, 0];
