import zxcvbn from 'zxcvbn';

export enum PasswordFormEnum {
  currentPassphrase = 'currentPassphrase',
  passphrase = 'passphrase',
  confirmPassphrase = 'confirmPassphrase',
}

export interface PasswordForm {
  confirmPassphrase: string;
  passphrase: string;
  currentPassphrase?: string;
}

export const isSamePasswordValidation = (
  values: PasswordForm,
  dirtyFields: PasswordForm
): boolean => {
  return (
    dirtyFields.confirmPassphrase != null &&
    dirtyFields.passphrase != null &&
    values.passphrase === values.confirmPassphrase
  );
};

export enum PasswordStrengthScore {
  VeryWeak = 0,
  Weak,
  Medium,
  Strong,
  VeryStrong,
}

export const getPasswordStrength = (value: string): number => {
  return zxcvbn(value).score;
};

export const isPasswordStrong = (value: string): boolean => {
  return getPasswordStrength(value) > PasswordStrengthScore.Medium;
};

export interface PasswordValidationModel {
  required: boolean;
  validate: any;
}

export const currentPasswordValidation = {
  required: true,
};

export const getPasswordValidationRules = (
  isSameWithConfirm: (
    values: PasswordForm,
    dirtyFields: PasswordForm
  ) => boolean,
  hasStrengthValidation?: boolean
): PasswordValidationModel => {
  const validate: any = {
    isSameWithConfirm,
  };
  if (hasStrengthValidation) {
    validate.isPasswordStrong = isPasswordStrong;
  }
  return {
    required: true,
    validate,
  };
};
