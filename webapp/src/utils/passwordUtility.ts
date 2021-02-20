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
  ) => boolean
): PasswordValidationModel => {
  return {
    required: true,
    validate: {
      isSameWithConfirm,
    },
  };
};
