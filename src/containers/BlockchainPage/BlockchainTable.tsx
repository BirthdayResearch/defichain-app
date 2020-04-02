import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink
} from 'reactstrap';
import {
  MdChevronLeft,
  MdChevronRight,
  MdFirstPage,
  MdLastPage
} from 'react-icons/md';
import styles from './BlockchainTable.module.scss';

class BlockchainTable extends Component<any,any> {
  state = {
    blocks: [
      { height: 612138, age: 'Jan 10, 2020 11:12:25 AM', txns: '2851', minerName: 'Miner A', minerID: 1, size: '93770' },
      { height: 612137, age: 'Jan 10, 2020 11:12:25 AM', txns: '2851', minerName: 'Miner A', minerID: 1, size: '93770' },
      { height: 612136, age: 'Jan 10, 2020 11:12:25 AM', txns: '2851', minerName: 'Miner B', minerID: 2, size: '93770' },
      { height: 612135, age: 'Jan 10, 2020 11:12:25 AM', txns: '2851', minerName: 'Miner C', minerID: 3, size: '93770' },
      { height: 612134, age: 'Jan 10, 2020 11:12:25 AM', txns: '2851', minerName: 'Miner A', minerID: 1, size: '93770' },
      { height: 612133, age: 'Jan 10, 2020 11:12:25 AM', txns: '2851', minerName: 'Miner B', minerID: 2, size: '93770' },
      { height: 612132, age: 'Jan 10, 2020 11:12:25 AM', txns: '2851', minerName: 'Miner B', minerID: 2, size: '93770' },
      { height: 612131, age: 'Jan 10, 2020 11:12:25 AM', txns: '2851', minerName: 'Miner A', minerID: 1, size: '93770' },
      { height: 612130, age: 'Jan 10, 2020 11:12:25 AM', txns: '2851', minerName: 'Miner A', minerID: 1, size: '93770' },
      { height: 612129, age: 'Jan 10, 2020 11:12:25 AM', txns: '2851', minerName: 'Miner C', minerID: 3, size: '93770' },
      { height: 612128, age: 'Jan 10, 2020 11:12:25 AM', txns: '2851', minerName: 'Miner C', minerID: 3, size: '93770' },
      { height: 612127, age: 'Jan 10, 2020 11:12:25 AM', txns: '2851', minerName: 'Miner A', minerID: 1, size: '93770' }
    ]
  };

  render() {
    return (
      <>
        <Card className={styles.card}>
          <div className={`${styles.tableResponsive} table-responsive-xl`}>
            <Table className={styles.table}>
              <thead>
                <tr>
                  <th>Height</th>
                  <th>Age</th>
                  <th>Transactions</th>
                  <th>Mined by</th>
                  <th>Size</th>
                </tr>
              </thead>
              <tbody>
                {this.state.blocks.map((block) => (
                  <tr key={block.height}>
                    <td>
                      <Link to={`/blockchain/block/${block.height}`}>{block.height}</Link>
                    </td>
                    <td>
                      <div>
                        {block.age}
                      </div>
                    </td>
                    <td>
                      <div>
                        {block.txns}
                      </div>
                    </td>
                    <td>
                      <div>
                        <Link to={`/blockchain/miner/${block.minerID}`}>{block.minerName}</Link>
                      </div>
                    </td>
                    <td>
                      <div>
                        {block.size}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>
            612127 – 612138 of 999,999,999 blocks
          </div>
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
    )
  }
}

export default BlockchainTable;