import React, { Component } from "react";
import { Button, Card } from "reactstrap";
import { MdContentCopy, MdInfo, MdArrowForward } from "react-icons/md";
import styles from "./BlockTxn.module.scss";
import CopyToClipboard from "react-copy-to-clipboard";
import classnames from "classnames";
import { I18n } from "react-redux-i18n";

interface BlockTxnProps {
  txn: {
    hash: string;
    time: string;
    froms: Array<{
      address: string;
      amount: number | string;
    }>;
    tos: Array<{
      address: String;
      amount: number | string;
    }>;
  };
}

interface BlockTxnState {
  copied: boolean;
}

class BlockTxn extends Component<BlockTxnProps, BlockTxnState> {
  state = {
    copied: false,
  };

  handleCopy = () => {
    this.setState({
      copied: true,
    });
    setTimeout(() => {
      this.setState({
        copied: false,
      });
    }, 600);
  };

  render() {
    const txn = this.props.txn;
    const froms = txn.froms;
    let fromsRender;

    if (froms.length) {
      fromsRender = froms.map((from) => (
        <div className={styles.from}>
          <span className={styles.address}>
            {from.address
              ? from.address
              : I18n.t("containers.blockChainPage.blockTxn.unparsedAddress")}
            }
          </span>
          <span className={styles.amount}>
            {from.amount} {I18n.t("containers.blockChainPage.blockTxn.dFI")}
          </span>
        </div>
      ));
    } else {
      fromsRender = (
        <div className={styles.fromsEmpty}>
          {I18n.t("containers.blockChainPage.blockTxn.noInputs")}
        </div>
      );
    }

    return (
      <Card className={`${styles.txn} styles.txn`}>
        <div className={styles.header}>
          <span className={styles.hash}>
            <div
              className={classnames(
                { "d-block": this.state.copied },
                styles.copiedIndicator
              )}
            >
              {I18n.t("containers.blockChainPage.blockTxn.copied")}
            </div>
            <span className={styles.hashSpan}>{txn.hash}</span>
            <CopyToClipboard text={txn.hash}>
              <Button
                color="link"
                size="sm"
                className="padless ml-2"
                onClick={this.handleCopy}
              >
                <MdContentCopy />
              </Button>
            </CopyToClipboard>
          </span>
          <span className={styles.time}>
            <span className={styles.timeSpan}>{txn.time}</span>
            <Button color="link" size="sm" className="padless ml-2">
              <MdInfo />
            </Button>
          </span>
        </div>
        <div className={styles.addresses}>
          <div className={styles.froms}>{fromsRender}</div>
          <div className={styles.arrow}>
            <MdArrowForward />
          </div>
          <div className={styles.tos}>
            {txn.tos.map((to) => (
              <div className={styles.to}>
                <span className={styles.address}>
                  {to.address
                    ? to.address
                    : I18n.t(
                        "containers.blockChainPage.blockTxn.unparsedAddress"
                      )}
                </span>
                <span className={styles.amount}>
                  {to.amount} {I18n.t("containers.blockChainPage.blockTxn.dFI")}
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
