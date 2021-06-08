import React from 'react';
import { I18n } from 'react-redux-i18n';
import { Button } from 'reactstrap';
import { onViewOnChain } from '../../utils/utility';

interface ViewOnChainProps {
  txid: string;
  isSPV?: boolean;
}

const ViewOnChain: React.FunctionComponent<ViewOnChainProps> = (
  props: ViewOnChainProps
) => {
  const { txid, isSPV } = props;

  return (
    <Button
      onClick={() => onViewOnChain(txid, isSPV)}
      color='link'
      className='mr-3'
    >
      {I18n.t('containers.swap.addLiquidity.viewOnChain')}
    </Button>
  );
};

export default ViewOnChain;
