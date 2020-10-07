import React from 'react';
import { Card, Table, Input } from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import { MdDelete, MdCropFree } from 'react-icons/md';

import styles from './AddressList.module.scss';
import { useState } from 'react';

interface AddressListProps {
  csvData: any;
  handleDeleteAll: () => void;
  handleDelete: (address: string) => void;
  newAddressFlag: boolean;
  openScanner: () => void;
  handleOnEnterPress: (e) => void;
}

const AddressList: React.FunctionComponent<AddressListProps> = (
  props: AddressListProps
) => {
  const [customAddress, setCustomAddress] = useState<string>('');

  const {
    csvData,
    handleDeleteAll,
    handleDelete,
    openScanner,
    newAddressFlag,
    handleOnEnterPress,
  } = props;

  return (
    <>
      <Card className={styles.card}>
        <div className={`${styles.tableResponsive} table-responsive-xl`}>
          <Table className={styles.table}>
            <thead>
              <tr>
                <th>{I18n.t('containers.tokens.dctDistribution.address')}</th>
                <th className='text-right'>
                  {!!csvData.length && (
                    <MdDelete
                      onClick={() => handleDeleteAll()}
                      style={{
                        height: '20px',
                        width: '20px',
                      }}
                    />
                  )}
                </th>
              </tr>
            </thead>
            {newAddressFlag ? (
              <tr
                className={styles.masternodeRow}
                style={{
                  borderBottom: '1px solid #cccccc',
                }}
              >
                <td>
                  <input
                    style={{
                      border: 'none',
                      width: '100%',
                    }}
                    type='text'
                    placeholder={I18n.t(
                      'containers.tokens.dctDistribution.enterDfiAddress'
                    )}
                    value={customAddress}
                    onChange={(e) => setCustomAddress(e.target.value)}
                    onKeyPress={(event) => {
                      if (event.key === 'Enter') {
                        handleOnEnterPress(event);
                        setCustomAddress('');
                      }
                    }}
                  />
                </td>
                <td className='text-right'>
                  <MdCropFree
                    onClick={() => openScanner()}
                    style={{
                      height: '20px',
                      width: '20px',
                    }}
                  />
                </td>
              </tr>
            ) : (
              ''
            )}
            {csvData.length || newAddressFlag ? (
              <tbody className='mh-100'>
                {csvData.map((address) => (
                  <tr key={address} className={styles.masternodeRow}>
                    <td>{address}</td>
                    <td className='text-right'>
                      <MdDelete
                        onClick={() => handleDelete(address)}
                        style={{
                          height: '20px',
                          width: '20px',
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <div className='h-100'>
                <div className={`${styles.marginTop} text-center`}>
                  {I18n.t('containers.tokens.dctDistribution.addAddressesText')}
                </div>
              </div>
            )}
          </Table>
        </div>
      </Card>
    </>
  );
};

export default AddressList;
