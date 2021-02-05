import React from 'react';
import { I18n } from 'react-redux-i18n';
import styles from './RecentWalletsList.module.scss';
import { Button, ListGroup, ListGroupItem } from 'reactstrap';
import { shortenedPathAddress } from '../../../../../utils/utility';

interface RecentWalletsListProps {
  paths: string[];
  onRestore: (p: string) => void;
}

const RecentWalletsList: React.FunctionComponent<RecentWalletsListProps> = (
  props: RecentWalletsListProps
) => {
  const { paths, onRestore } = props;
  return (
    <ListGroup>
      {paths?.map((p, index) => {
        return (
          <ListGroupItem key={index} className={styles.listGroupItem}>
            <div>
              <span>{shortenedPathAddress(p)}</span>
            </div>
            <div>
              <Button color='link' className='p-0' onClick={() => onRestore(p)}>
                {I18n.t('containers.wallet.restoreWalletPage.restore')}
              </Button>
            </div>
          </ListGroupItem>
        );
      })}
    </ListGroup>
  );
};

export default RecentWalletsList;
