import React, { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { I18n } from 'react-redux-i18n';
import {
  Button,
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  Row,
} from 'reactstrap';
import { debounce } from 'lodash';
import { MdClose } from 'react-icons/md';
import NumberFormat from 'react-number-format';

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
  return (
    <Row className='mb-4'>
      <Col md='4'>
        <span>{I18n.t('containers.swap.slippage.slippageTolerance')}</span>
      </Col>
      <Col md='8'>
        <SlippageSelector
          slippage={slippage}
          slippageError={slippageError}
          setSlippageError={setSlippageError}
          onSubmitSlippage={setSlippage}
        />
      </Col>
    </Row>
  );
}

interface SlippageSelectorProps {
  onSubmitSlippage: (val: BigNumber) => void;
  slippage: BigNumber;
  slippageError?: string;
  setSlippageError: (error?: string) => void;
}

function SlippageSelector({
  onSubmitSlippage,
  slippage,
  setSlippageError,
}: SlippageSelectorProps): JSX.Element {
  const [selectedSlippage, setSelectedSlippage] = useState(slippage.toString());
  const [isRiskWarningDisplayed, setIsRiskWarningDisplayed] = useState(false);
  const submitSlippage = debounce(onSubmitSlippage, 500);

  const onSlippageChange = (value: string): void => {
    setSelectedSlippage(value);
    submitSlippage(new BigNumber(value));
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
    <Row className='text-center text-md-right'>
      <Col lg='8' md='6' />
      <Col lg='4' md='6'>
        <InputGroup>
          <NumberFormat
            value={selectedSlippage.toString()}
            customInput={Input}
            type='text'
            max={100}
            min={0}
            name='slippage'
            id='slippage'
            suffix='%'
            placeholder='0.00%'
            onValueChange={(e) => onSlippageChange(e.value)}
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
      </Col>
    </Row>
  );
}
