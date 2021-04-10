import React, { useEffect, useState } from 'react';
import { Card, Table, CardBody, Progress } from 'reactstrap';
import styles from './TokenTable.module.scss';
import { I18n } from 'react-redux-i18n';
import TokenAvatar from '../TokenAvatar';
import NumberMask from '../NumberMask';
import BigNumber from 'bignumber.js';
import { MdArrowDownward } from 'react-icons/md';
import { price } from 'src/constants';

interface TokenTableProps {
  token: any[];
}

const TokenTable: React.FunctionComponent<TokenTableProps> = (
  props: TokenTableProps
) => {
  const { token } = props;
  const [total, setTotal] = useState(0);
  let totalSum = 0;

  const handleValueCalculate = (price, value) => {
    const Value: any = new BigNumber(value || 0).toFixed(8);
    totalSum += Value * price;
    return Value * price;
  };

  useEffect(() => {
    setTotal(totalSum);
  }, []);

  return (
    <>
      {token ? (
        <>
          <Card className={styles.card}>
            <div className={`${styles.tableResponsive} table-responsive-xl`}>
              <Table className={styles.table}>
                <thead>
                  <tr>
                    <th>{I18n.t('containers.wallet.walletPage.asset')}</th>
                    <th>{I18n.t('containers.wallet.walletPage.balance')}</th>
                    <th>
                      {I18n.t('containers.wallet.walletPage.price')}
                      &nbsp;
                      <span className='text-muted'>
                        {I18n.t('containers.wallet.walletPage.usd')}
                      </span>
                    </th>
                    <th>
                      {I18n.t('containers.wallet.walletPage.value')}
                      &nbsp;
                      <span className='text-muted'>
                        {I18n.t('containers.wallet.walletPage.usd')}
                        <MdArrowDownward size={25} />
                      </span>
                    </th>
                    {/* <th>
                      {I18n.t('containers.wallet.walletPage.allocation')}
                    </th> */}
                  </tr>
                </thead>
                <tbody>
                  {token.map((token, index) => (
                    <tr key={index}>
                      <td>
                        <div>
                          <TokenAvatar
                            symbol={token.symbolKey}
                            textSizeRatio={2}
                          />
                          &nbsp;
                          {token.symbol}
                        </div>
                      </td>
                      <td>
                        <div>
                          <NumberMask
                            value={new BigNumber(token.amount || 0).toFixed(8)}
                          />
                        </div>
                      </td>
                      <td>
                        <div>{price}</div>
                      </td>
                      <td>
                        <div>{handleValueCalculate(price, token.amount)}</div>
                      </td>
                      {/* <td>
                        <div>
                          <p>76%</p>
                          <span>
                            <Progress
                              animated
                              value={76}
                            />
                          </span>
                        </div>
                      </td> */}
                    </tr>
                  ))}
                  <tr>
                    <td>
                      <div>
                        {I18n.t('containers.wallet.walletPage.totalValue')}
                      </div>
                    </td>
                    <td>
                      <div></div>
                    </td>
                    <td>
                      <div></div>
                    </td>
                    <td>
                      <div>{total}</div>
                    </td>
                    {/* <td>
                      <div>
                      </div>
                    </td> */}
                  </tr>
                </tbody>
              </Table>
            </div>
          </Card>
        </>
      ) : (
        <Card className='table-responsive-md'>
          <CardBody>
            {I18n.t('containers.blockChainPage.blockChainTable.noBlocks')}
          </CardBody>
        </Card>
      )}
    </>
  );
};

export default TokenTable;
