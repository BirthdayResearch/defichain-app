import React, { useState } from 'react';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { I18n } from 'react-redux-i18n';
import { FormGroup, Input, Label } from 'reactstrap';
import styles from './InputPassword.module.scss';

interface InputPasswordProps {
  label: string;
  name: string;
  id: string;
  onChange: (e) => void;
  invalid: boolean;
  isDirty: boolean;
}

const InputPassword: React.FunctionComponent<InputPasswordProps> = (
  props: InputPasswordProps
) => {
  const { label, name, id, onChange, invalid, isDirty } = props;
  const [showPassword, setShowPassword] = useState(false);
  const onPasswordView = () => {
    setShowPassword(!showPassword);
  };

  return (
    <FormGroup className={'form-label-group'}>
      <div className='d-flex'>
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
    </FormGroup>
  );
};

export default InputPassword;
