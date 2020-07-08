import { DEFAULT_UNIT, UNIT, LANG_VARIABLE, ENGLISH } from '../src/constants';

export function initTest() {
  localStorage.setItem(UNIT, DEFAULT_UNIT);
  localStorage.setItem(LANG_VARIABLE, ENGLISH);
}
