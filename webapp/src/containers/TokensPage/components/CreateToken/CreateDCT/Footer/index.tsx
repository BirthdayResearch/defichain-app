import React from 'react';
import { I18n } from 'react-redux-i18n';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';
import { MdCheckCircle, MdErrorOutline } from 'react-icons/md';
import { Row, Col, Button } from 'reactstrap';

import styles from '../CreateDCT.module.scss';
import {
  TOKENS_PATH,
  MINIMUM_DFI_REQUIRED_FOR_TOKEN_CREATION,
} from '../../../../../../constants';
import { ITokenResponse } from '../../../../../../utils/interfaces';
import Spinner from '../../../../../../components/Svg/Spinner';
import { CreateTokenFormState } from '../..';
import ViewOnChain from '../../../../../../components/ViewOnChain';

interface CreateDCTProps {
  isUpdate: boolean;
  formState: CreateTokenFormState;
  isConfirmationModalOpen: string;
  setIsConfirmationModalOpen: (state: string) => void;
  cancelConfirmation: () => void;
  createConfirmation: () => void;
  updateConfirmation: () => void;
  wait: number;
  createdTokenData: ITokenResponse;
  isErrorCreatingToken: string;
  isErrorUpdatingToken: string;
  updatedTokenData: ITokenResponse;
  IsCollateralAddressValid: boolean;
}

const Footer: React.FunctionComponent<CreateDCTProps> = (
  props: CreateDCTProps
) => {
  const {
    isUpdate,
    formState,
    isConfirmationModalOpen,
    setIsConfirmationModalOpen,
    cancelConfirmation,
    createConfirmation,
    updateConfirmation,
    wait,
    createdTokenData,
    isErrorCreatingToken,
    updatedTokenData,
    isErrorUpdatingToken,
    IsCollateralAddressValid,
  } = props;

  return (
    <>
      <footer className='footer-bar'>
        <div
          className={classnames({
            'd-none': isConfirmationModalOpen !== 'default',
          })}
        >
          <Row className='justify-content-between align-items-center'>
            <Col className='col-auto'>
              <div className='caption-secondary'>
                {I18n.t('containers.tokens.createToken.dfiRequired')}
              </div>
              <div>
                {MINIMUM_DFI_REQUIRED_FOR_TOKEN_CREATION}
                &nbsp;
                {'DFI'}
              </div>
            </Col>
            <Col className='d-flex justify-content-end'>
              <Button
                to={TOKENS_PATH}
                tag={NavLink}
                color='link'
                className='mr-3'
              >
                {I18n.t('containers.tokens.createToken.cancel')}
              </Button>
              {isUpdate ? (
                <Button
                  disabled={
                    !formState.symbol ||
                    formState.symbol.length > 8 ||
                    formState.name.length > 128
                  }
                  onClick={() => {
                    setIsConfirmationModalOpen('confirm');
                  }}
                  color='primary'
                >
                  {I18n.t('containers.tokens.createToken.updateTokenButton')}
                </Button>
              ) : (
                <Button
                  disabled={
                    !formState.symbol ||
                    !formState.receiveAddress ||
                    formState.symbol.length > 8 ||
                    formState.name.length > 128 ||
                    !IsCollateralAddressValid
                  }
                  onClick={() => {
                    setIsConfirmationModalOpen('confirm');
                  }}
                  color='primary'
                >
                  {I18n.t('containers.tokens.createToken.createTokenButton')}
                </Button>
              )}
            </Col>
          </Row>
        </div>
        <div
          className={classnames({
            'd-none': isConfirmationModalOpen !== 'confirm',
          })}
        >
          <div className='footer-sheet'>
            <dl className='row'>
              <dd className='col-12'>
                <span className='h2 mb-0'>
                  {isUpdate
                    ? I18n.t(
                        'containers.tokens.createToken.updateConfirmationText'
                      )
                    : I18n.t(
                        'containers.tokens.createToken.createConfirmationText'
                      )}
                </span>
              </dd>
            </dl>
          </div>
          <Row className='justify-content-between align-items-center'>
            <Col className='d-flex justify-content-end'>
              <Button
                color='link'
                className='mr-3'
                onClick={() => cancelConfirmation()}
              >
                {I18n.t('containers.masterNodes.createMasterNode.noButtonText')}
              </Button>
              <Button
                color='primary'
                onClick={() => {
                  isUpdate ? updateConfirmation() : createConfirmation();
                }}
                disabled={wait > 0 ? true : false}
              >
                {I18n.t(
                  'containers.masterNodes.createMasterNode.yesButtonText'
                )}
                &nbsp;
                <span className='timer'>{wait > 0 ? wait : ''}</span>
              </Button>
            </Col>
          </Row>
        </div>
        <div
          className={classnames({
            'd-none': isConfirmationModalOpen !== 'loading',
          })}
        >
          <div className='footer-sheet'>
            <div className='text-center'>
              <Spinner />
            </div>
          </div>
        </div>
        <div
          className={classnames({
            'd-none': isConfirmationModalOpen !== 'success',
          })}
        >
          <div className='footer-sheet'>
            <div className='text-center'>
              <p>
                {isUpdate
                  ? I18n.t('containers.tokens.createToken.updateTokenSuccess')
                  : I18n.t('containers.tokens.createToken.createTokenSuccess')}
              </p>
              <MdCheckCircle className='footer-sheet-icon' />
              <p>
                {`${I18n.t('containers.tokens.createToken.tokenHash')}: ${
                  isUpdate ? updatedTokenData.hash : createdTokenData.hash
                }`}
              </p>
            </div>
          </div>
          <Row className='justify-content-between align-items-center'>
            <Col className='d-flex justify-content-end'>
              <ViewOnChain
                txid={isUpdate ? updatedTokenData.hash : createdTokenData.hash}
              />
              <Button color='primary' to={TOKENS_PATH} tag={NavLink}>
                {I18n.t('containers.tokens.createToken.backToTokenPage')}
              </Button>
            </Col>
          </Row>
        </div>
        <div
          className={classnames({
            'd-none': isConfirmationModalOpen !== 'failure',
          })}
        >
          <div className='footer-sheet'>
            <div className='text-center'>
              <MdErrorOutline
                className={classnames({
                  'footer-sheet-icon': true,
                  [styles[`error-dialog`]]: true,
                })}
              />
              <p>{isUpdate ? isErrorUpdatingToken : isErrorCreatingToken}</p>
            </div>
          </div>
          <div className='d-flex align-items-center justify-content-center'>
            <Button color='primary' to={TOKENS_PATH} tag={NavLink}>
              {I18n.t('containers.tokens.createToken.backToTokenPage')}
            </Button>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
