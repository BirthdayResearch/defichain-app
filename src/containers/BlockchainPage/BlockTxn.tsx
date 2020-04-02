import React, { Component } from 'react';
import {
  Button,
  Card
} from 'reactstrap';
import {
  MdContentCopy,
  MdInfo,
  MdArrowForward,
} from 'react-icons/md';
import styles from './BlockTxn.module.scss';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import classnames from 'classnames';

class BlockTxn extends Component<any,any> {
  state = {
    copied: false
  }

  handleCopy = () => {
    this.setState({
      copied: true
    });
    setTimeout(() => {
      this.setState({
        copied: false
      });
    }, 600);
  }

  render() {
    const txn = this.props.txn;
    const froms = txn.froms;
    let fromsRender;

    if (froms.length) {
      fromsRender = (
        froms.map((from) => (
          <div className={styles.from}>
            <span className={styles.address}>
              {from.address ? from.address : "Unparsed address"}
            </span>
            <span className={styles.amount}>
              {from.amount} DFI
            </span>
          </div>
        ))
      );
    } else {
      fromsRender = (
        <div className={styles.fromsEmpty}>
          No Inputs (Newly Generated Coins)
        </div>
      )
    }

    return (
      <Card className={`${styles.txn} styles.txn`}>
        <div className={styles.header}>
          <span className={styles.hash}>
            <div className={classnames({ 'd-block': this.state.copied }, styles.copiedIndicator)}>Copied!</div>
            <span className={styles.hashSpan}>{txn.hash}</span>
            <CopyToClipboard text={txn.hash}>
              <Button
                color="link" size="sm"
                className="padless ml-2"
                onClick={this.handleCopy}
              >
                <MdContentCopy />
              </Button>
            </CopyToClipboard>
          </span>
          <span className={styles.time}>
            <span className={styles.timeSpan}>{txn.time}</span>
            <Button
              color="link" size="sm"
              className="padless ml-2"
            >
              <MdInfo />
            </Button>
          </span>
        </div>
        <div className={styles.addresses}>
          <div className={styles.froms}>
            {fromsRender}
          </div>
          <div className={styles.arrow}>
            <MdArrowForward />
          </div>
          <div className={styles.tos}>
            {txn.tos.map((to) => (
              <div className={styles.to}>
                <span className={styles.address}>
                  {to.address ? to.address : "Unparsed address"}
                </span>
                <span className={styles.amount}>
                  {to.amount} DFI
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }
}

export default BlockTxn;