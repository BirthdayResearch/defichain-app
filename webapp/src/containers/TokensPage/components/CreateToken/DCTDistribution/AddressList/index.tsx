// Not in use component. Don't delete it for future purposes

import React from 'react';
import { Card, Table } from 'reactstrap';
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
                      className={styles.icon}
                      onClick={() => handleDeleteAll()}
                    />
                  )}
                </th>
              </tr>
            </thead>
            {newAddressFlag && (
              <tr className={`${styles.masternodeRow} ${styles.borderBottom}`}>
                <td>
                  <input
                    className={styles.borderNone}
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
                    className={styles.icon}
                    onClick={() => openScanner()}
                  />
                </td>
              </tr>
            )}
            {csvData.length || newAddressFlag ? (
              <tbody className='mh-100'>
                {csvData.map((address) => (
                  <tr key={address} className={styles.masternodeRow}>
                    <td>{address}</td>
                    <td className='text-right'>
                      <MdDelete
                        className={styles.icon}
                        onClick={() => handleDelete(address)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody className='h-100'>
                <tr className={`${styles.marginTop} text-center`}>
                  <td>
                    {I18n.t(
                      'containers.tokens.dctDistribution.addAddressesText'
                    )}
                  </td>
                  <td />
                </tr>
              </tbody>
            )}
          </Table>
        </div>
      </Card>
    </>
  );
};

export default AddressList;
