// Not in use component. Don't delete it for future purposes

import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { I18n } from 'react-redux-i18n';
import { NavLink } from 'react-router-dom';
import QrReader from 'react-qr-reader';
import { MdFileUpload, MdAdd, MdArrowBack } from 'react-icons/md';
import classnames from 'classnames';
import { Row, Col, ButtonGroup, Button, Modal, ModalBody } from 'reactstrap';

import CsvReader from '../../../../../components/CsvReader';
import Spinner from '../../../../../components/Svg/Spinner';
import AddressList from './AddressList';
import * as log from '../../../../../utils/electronLogger';
import { TOKENS_PATH, CREATE_DCT } from '../../../../../constants';
import Header from '../../../../HeaderComponent';
import { getPageTitle } from '../../../../../utils/utility';

interface DCTDistributionProps {
  handleActiveTab: (active: string) => void;
  csvData: any;
  setCsvData: (data) => void;
  handleSubmit: () => void;
  setIsVerifyingCollateralModalOpen: (state: boolean) => void;
  IsVerifyingCollateralModalOpen: boolean;
}

const DCTDistribution: React.FunctionComponent<DCTDistributionProps> = (
  props: DCTDistributionProps
) => {
  const [newAddressFlag, setNewAddressFlag] = React.useState<boolean>(false);
  const [flashed, setFlashed] = React.useState<string>('');
  const [uploadCsv, setuploadCsv] = useState<boolean>(false);
  const [openScanner, setOpenScanner] = useState<boolean>(false);

  const {
    handleActiveTab,
    setCsvData,
    csvData,
    handleSubmit,
    IsVerifyingCollateralModalOpen,
    setIsVerifyingCollateralModalOpen,
  } = props;

  const handleOnDrop = (data, file) => {
    if (file.type !== 'text/csv') {
      setuploadCsv(false);
    } else {
      const transformedData = data.map((address) => address.data[0]);
      setCsvData(transformedData);
      setuploadCsv(false);
    }
  };

  const handleOnEnterPress = (e) => {
    setCsvData([...csvData, e.target.value]);
  };

  const handleOnError = (err, file, inputElem, reason) => {
    setCsvData([]);
    setuploadCsv(false);
  };

  const handleOnRemoveFile = () => {
    setCsvData([]);
    setuploadCsv(false);
  };

  const handleDeleteAll = () => {
    setCsvData([]);
  };

  const handleDelete = (address: string) => {
    const filteredData = csvData.filter((addr) => addr !== address);
    setCsvData(filteredData);
  };

  const handleAddNewAddress = () => {
    setNewAddressFlag(true);
  };

  const handleOpenScanner = () => {
    setOpenScanner(true);
  };

  const handleToggleScanner = () => {
    setOpenScanner(false);
  };

  const handleScanError = (err) => {
    log.error(err);
  };

  const handleScan = (data) => {
    const updatedState = {
      flashed: 'flashed',
      toAddress: '',
      uriData: '',
    };
    if (data) {
      if (data.includes('DFI')) {
        updatedState.uriData = data;
      } else {
        updatedState.toAddress = data;
      }
      // shutterSnap.play();
      // this.setState(updatedState);
      // setTimeout(() => {
      //   this.isQRCodeValid();
      //   this.toggleScanner();
      //   this.setState({
      //     flashed: '',
      //   });
      // }, 600);
    }
  };

  return (
    <>
      <Helmet>
        <title>
          {getPageTitle(I18n.t('containers.tokens.tokensPage.title'))}
        </title>
      </Helmet>
      <Header>
        <Button
          onClick={() => handleActiveTab(CREATE_DCT)}
          color='link'
          className='header-bar-back'
        >
          <MdArrowBack />
          <span className='d-lg-inline'>
            {I18n.t('containers.tokens.dctDistribution.back')}
          </span>
        </Button>
        <h1 className={classnames({ 'd-none': false })}>
          {I18n.t('containers.tokens.dctDistribution.dctDistribution')}
        </h1>
        <ButtonGroup>
          <Button color='link' onClick={() => setuploadCsv(true)}>
            <MdFileUpload />
            <span className='d-lg-inline'>
              {I18n.t('containers.tokens.dctDistribution.uploadCsv')}
            </span>
          </Button>
          <Button color='link' onClick={() => handleAddNewAddress()}>
            <MdAdd />
            <span className='d-lg-inline'>
              {I18n.t('containers.tokens.dctDistribution.addAddress')}
            </span>
          </Button>
        </ButtonGroup>
      </Header>
      <div className='content'>
        <section className='h-100'>
          <AddressList
            csvData={csvData}
            handleDeleteAll={handleDeleteAll}
            handleDelete={handleDelete}
            newAddressFlag={newAddressFlag}
            openScanner={handleOpenScanner}
            handleOnEnterPress={handleOnEnterPress}
          />
          <Modal
            isOpen={uploadCsv}
            centered={true}
            toggle={() => setuploadCsv(false)}
          >
            <ModalBody className='p-5'>
              <CsvReader
                handleOnDrop={handleOnDrop}
                handleOnError={handleOnError}
                handleOnRemoveFile={handleOnRemoveFile}
              />
            </ModalBody>
          </Modal>
          <Modal
            isOpen={openScanner}
            toggle={handleToggleScanner}
            centered={true}
            className={`qr-scanner ${flashed}`}
          >
            <ModalBody>
              <QrReader
                delay={1000}
                onError={handleScanError}
                onScan={handleScan}
                showViewFinder={false}
                className='qr-scanner-preview w-100'
              />
            </ModalBody>
          </Modal>
        </section>
      </div>
      <footer className='footer-bar'>
        <div
          className={classnames({
            'd-none': IsVerifyingCollateralModalOpen,
          })}
        >
          <Row className='justify-content-between align-items-center'>
            <Col className='col-auto'>
              <div className='caption-secondary'>
                {I18n.t('containers.tokens.createToken.dfiRequired')}
              </div>
              <div>
                {'1,000'}
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
              <Button
                color='primary'
                disabled={!csvData.length}
                onClick={() => {
                  setIsVerifyingCollateralModalOpen(true);
                  handleSubmit();
                }}
              >
                {I18n.t('containers.tokens.createToken.continue')}
              </Button>
            </Col>
          </Row>
        </div>
        <div
          className={classnames({
            'd-none': !IsVerifyingCollateralModalOpen,
          })}
        >
          <div className='footer-sheet'>
            <dl className='row'>
              <dd className='col-12'>
                <Spinner />
                <span className='mb-0'>
                  {I18n.t(
                    'containers.tokens.dctDistribution.verifyingCollateral'
                  )}
                </span>
              </dd>
            </dl>
          </div>
        </div>
      </footer>
    </>
  );
};

export default DCTDistribution;
