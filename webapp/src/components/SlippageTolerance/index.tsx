import React, { ReactElement, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { I18n } from 'react-redux-i18n';
import {
  Button,
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  Row,
} from 'reactstrap';
import { debounce } from 'lodash';
import { MdEdit, MdClose } from 'react-icons/md';
import styles from './SlippageTolerance.module.scss';

const percentageList = ['0.5', '1', '3', '5', '10'];

interface SlippageToleranceProps {
  slippage: BigNumber;
  slippageError?: string;
  setSlippageError: (error?: string) => void;
  setSlippage: (slippage: BigNumber) => void;
}

export default function SlippageTolerance({
  slippage,
  setSlippage,
  slippageError,
  setSlippageError,
}: SlippageToleranceProps): JSX.Element {
  const [isCustomSlippage, setIsCustomSlippage] = useState(false);
  useEffect(() => {
    setIsCustomSlippage(
      !percentageList.includes(new BigNumber(slippage).toString())
    );
  }, []);

  return (
    <Row>
      <Col md='4' className='mt-1'>
        <span>{I18n.t('containers.swap.slippage.slippageTolerance')}</span>
      </Col>
      <Col md='8'>
        <SlippageSelector
          slippage={slippage}
          slippageError={slippageError}
          setSlippageError={setSlippageError}
          isCustomSlippage={isCustomSlippage}
          setIsCustomSlippage={setIsCustomSlippage}
          onSubmitSlippage={setSlippage}
        />
      </Col>
    </Row>
  );
}

interface SlippageSelectorProps {
  isCustomSlippage: boolean;
  onSubmitSlippage: (val: BigNumber, isCustomSlippage: boolean) => void;
  setIsCustomSlippage: (val: boolean) => void;
  slippage: BigNumber;
  slippageError?: string;
  setSlippageError: (error?: string) => void;
}

function SlippageSelector({
  isCustomSlippage,
  onSubmitSlippage,
  slippage,
  setIsCustomSlippage,
  slippageError,
  setSlippageError,
}: SlippageSelectorProps): JSX.Element {
  const [selectedSlippage, setSelectedSlippage] = useState(slippage.toString());
  const [isRiskWarningDisplayed, setIsRiskWarningDisplayed] = useState(false);
  const submitSlippage = debounce(onSubmitSlippage, 500);

  const onSlippageChange = (value: string): void => {
    setSelectedSlippage(value);
    submitSlippage(new BigNumber(value), isCustomSlippage);
  };

  const validateSlippage = (value: string): void => {
    if (value === undefined || value === '') {
      setSlippageError(I18n.t('containers.swap.slippage.requiredFieldMissing'));
      return;
    } else if (
      !(new BigNumber(value).gte(0) && new BigNumber(value).lte(100))
    ) {
      setSlippageError(I18n.t('containers.swap.slippage.slippageRateRange'));
      return;
    }

    setSlippageError(undefined);
  };

  useEffect(() => {
    validateSlippage(selectedSlippage);
    setIsRiskWarningDisplayed(
      new BigNumber(selectedSlippage).gte(20) &&
        new BigNumber(selectedSlippage).lte(100)
    );
  }, [selectedSlippage]);

  return (
    <div className='mb-4'>
      <Row className='px-3'>
        {percentageList.map((value) => (
          <SlippageButton
            key={value}
            onPress={() => {
              setIsCustomSlippage(false);
              onSlippageChange(value);
            }}
            isActive={!isCustomSlippage && selectedSlippage === value}
            label={`${value}%`}
          />
        ))}
        <SlippageButton
          onPress={() => {
            setIsCustomSlippage(true);
          }}
          icon={<MdEdit size={10} />}
          isActive={isCustomSlippage}
          label={I18n.t('containers.swap.slippage.custom')}
        />
      </Row>

      {isCustomSlippage && (
        <InputGroup className='mt-2'>
          <Input
            type='text'
            placeholder={'0.00%'}
            name='toAddress'
            id='toAddress'
            value={selectedSlippage.toString()}
            onChange={(e) => onSlippageChange(e.target.value)}
          />
          <InputGroupAddon addonType='append'>
            <Button
              color='outline-primary'
              onClick={() => onSlippageChange('')}
            >
              <MdClose />
            </Button>
          </InputGroupAddon>
        </InputGroup>
      )}

      {isRiskWarningDisplayed && (
        <div className='text-danger mt-2'>
          {I18n.t('containers.swap.slippage.warning')}
        </div>
      )}
      {slippageError && <div className='text-danger mt-2'>{slippageError}</div>}
    </div>
  );
}

function SlippageButton({
  onPress,
  isActive,
  label,
  icon,
}: {
  onPress: () => void;
  isActive: boolean;
  label: string;
  icon?: ReactElement;
}): JSX.Element {
  return (
    <div>
      <Button
        color='primary'
        className='mr-1 mt-1'
        outline={!isActive}
        size='sm'
        onClick={onPress}
      >
        {icon}
        <div className={styles.inline}>{label}</div>
      </Button>
    </div>
  );
}
