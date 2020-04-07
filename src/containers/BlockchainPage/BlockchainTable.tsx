import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  Card,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import {
  MdChevronLeft,
  MdChevronRight,
  MdFirstPage,
  MdLastPage,
} from "react-icons/md";
import styles from "./BlockchainTable.module.scss";
import {
  BlockchainTableProps,
  BlockchainTableState,
} from "./BlockchainPage.interface";
import { I18n } from "react-redux-i18n";
import { fetchBlocksRequest } from "./reducer";

class BlockchainTable extends Component<
  BlockchainTableProps,
  BlockchainTableState
> {
  componentDidMount() {
    this.props.fetchBlocks();
  }

  render() {
    return (
      <>
        <Card className={styles.card}>
          <div className={`${styles.tableResponsive} table-responsive-xl`}>
            <Table className={styles.table}>
              <thead>
                <tr>
                  <th>
                    {I18n.t("containers.blockChainPage.blockChainTable.height")}
                  </th>
                  <th>
                    {I18n.t("containers.blockChainPage.blockChainTable.age")}
                  </th>
                  <th>
                    {I18n.t(
                      "containers.blockChainPage.blockChainTable.transactions"
                    )}
                  </th>
                  <th>
                    {I18n.t(
                      "containers.blockChainPage.blockChainTable.minedBy"
                    )}
                  </th>
                  <th>
                    {I18n.t("containers.blockChainPage.blockChainTable.size")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {this.props.blocks.map((block) => (
                  <tr key={block.height}>
                    <td>
                      <Link to={`/blockchain/block/${block.height}`}>
                        {block.height}
                      </Link>
                    </td>
                    <td>
                      <div>{block.age}</div>
                    </td>
                    <td>
                      <div>{block.txns}</div>
                    </td>
                    <td>
                      <div>
                        <Link to={`/blockchain/miner/${block.minerID}`}>
                          {block.minerName}
                        </Link>
                      </div>
                    </td>
                    <td>
                      <div>{block.size}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>{I18n.t("containers.blockChainPage.blockChainTable.count")}</div>
          <Pagination className={styles.pagination}>
            <PaginationItem>
              <PaginationLink first href="#">
                <MdFirstPage />
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink previous href="#">
                <MdChevronLeft />
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink next href="#">
                <MdChevronRight />
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink last href="#">
                <MdLastPage />
              </PaginationLink>
            </PaginationItem>
          </Pagination>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    blocks,
    isBlocksLoaded,
    isLoadingBlocks,
    blocksLoadError,
  } = state.blockchain;
  return {
    blocks,
    isBlocksLoaded,
    isLoadingBlocks,
    blocksLoadError,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchBlocks: () => dispatch(fetchBlocksRequest()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BlockchainTable);
