export const isValidNumber = value => {
  return /^(?=.)(([0-9]*)(\.([0-9]+))?)$/.test(value);
};
