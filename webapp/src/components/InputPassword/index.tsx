import React, { useState } from 'react';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { I18n } from 'react-redux-i18n';
import { FormGroup, Input, Label } from 'reactstrap';
import styles from './InputPassword.module.scss';
import { PasswordStrengthScore } from '../../utils/passwordUtility';

interface InputPasswordProps {
  label: string;
  name: string;
  id: string;
  onChange: (e) => void;
  invalid: boolean;
  isDirty: boolean;
  hasStrengthChecker?: boolean;
  strengthScore?: number;
}

const InputPassword: React.FunctionComponent<InputPasswordProps> = (
  props: InputPasswordProps
) => {
  const {
    label,
    name,
    id,
    onChange,
    invalid,
    isDirty,
    hasStrengthChecker,
    strengthScore,
  } = props;
  const [showPassword, setShowPassword] = useState(false);
  const onPasswordView = () => {
    setShowPassword(!showPassword);
  };
  const encryptWalletLabel = 'containers.wallet.encryptWalletPage';
  const passwordScore = strengthScore || 0;

  const getStrengthColor = (score: number, minScore: number): string => {
    if (score >= minScore && isDirty) {
      if (score <= PasswordStrengthScore.Weak) {
        return styles.weak;
      } else if (score <= PasswordStrengthScore.Medium) {
        return styles.medium;
      } else {
        return styles.strong;
      }
    }
    return '';
  };

  return (
    <FormGroup className={'form-label-group'}>
      <div className='d-flex position-relative'>
        <Input
          type={showPassword ? 'text' : 'password'}
          name={name}
          id={id}
          placeholder={I18n.t(label)}
          className={styles.passwordInput}
          onChange={onChange}
          invalid={invalid && isDirty}
        />
        <Label for={id}>{I18n.t(label)}</Label>
        <div className={styles.passwordEye} onClick={() => onPasswordView()}>
          {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
        </div>
      </div>
      {hasStrengthChecker && (
        <div className={`${styles.strengthContainer}`}>
          <div className={`${styles.strengthBlocks}`}>
            <div
              className={`${styles.strengthBlock} ${
                styles.veryWeakBlock
              } ${getStrengthColor(
                passwordScore,
                PasswordStrengthScore.VeryWeak
              )}`}
            ></div>
            <div
              className={`${styles.strengthBlock} ${
                styles.weakBlock
              } ${getStrengthColor(passwordScore, PasswordStrengthScore.Weak)}`}
            ></div>
            <div
              className={`${styles.strengthBlock} ${
                styles.mediumBlock
              } ${getStrengthColor(
                passwordScore,
                PasswordStrengthScore.Medium
              )}`}
            ></div>
            <div
              className={`${styles.strengthBlock} ${
                styles.strongBlock
              } ${getStrengthColor(
                passwordScore,
                PasswordStrengthScore.Strong
              )}`}
            ></div>
            <div
              className={`${styles.strengthBlock} ${
                styles.veryStrongBlock
              } ${getStrengthColor(
                passwordScore,
                PasswordStrengthScore.VeryStrong
              )}`}
            ></div>
          </div>
          <p className={styles.passphraseStrengthLabel}>
            {I18n.t(`${encryptWalletLabel}.passphraseStrength`, {
              strength: I18n.t(
                !isDirty
                  ? `${encryptWalletLabel}.none`
                  : passwordScore > PasswordStrengthScore.Medium
                  ? `${encryptWalletLabel}.strong`
                  : `${encryptWalletLabel}.weak`
              ),
            })}
          </p>
        </div>
      )}
    </FormGroup>
  );
};

export default InputPassword;
