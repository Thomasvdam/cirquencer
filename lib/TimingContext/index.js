import microtime from 'microtime';

const START = microtime.nowDouble();

export const now = () => microtime.nowDouble() - START;

export default now;
