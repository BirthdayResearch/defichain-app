import React, { useState, useEffect } from 'react';
import { I18n } from 'react-redux-i18n';
import { Row, Col } from 'reactstrap';

import cloneDeep from 'lodash/cloneDeep';

import Pagination from '../../../../components/Pagination';
import { filterByValue } from '../../../../utils/utility';
import { TOKEN_LIST_PAGE_SIZE } from '../../../../constants';

interface TokensListProps {
  tokens: any;
  searchQuery: string;
  history: any;
  component: any;
  handleCardClick: (symbol: string, hash: string) => void;
}

const TokensList: React.FunctionComponent<TokensListProps> = (
  props: TokensListProps
) => {
  const defaultPage = 1;
  const [tableData, settableData] = useState([]);
  const [currentPage, setCurrentPage] = useState<number>(defaultPage);
  const { tokens, searchQuery, handleCardClick } = props;
  const pageSize = TOKEN_LIST_PAGE_SIZE;
  const total = tokens.length;
  const pagesCount = Math.ceil(total / pageSize);
  const from = (currentPage - 1) * pageSize;
  const to = Math.min(total, currentPage * pageSize);

  function paginate(pageNumber, tokensList?: any[]) {
    const clone = cloneDeep(tokensList || tokens);
    const tableData = clone.slice(
      (pageNumber - 1) * pageSize,
      pageNumber * pageSize
    );
    setCurrentPage(pageNumber);
    settableData(tableData);
  }

  useEffect(() => {
    if (!searchQuery) {
      paginate(currentPage);
    } else {
      const tokensList: any[] = filterByValue(tokens, searchQuery);
      paginate(defaultPage, tokensList);
    }
  }, [tokens, searchQuery]);

  return (
    <>
      <section>
        <Row>
          {tableData.map((tokenData, i) => (
            <Col md='6' key={i}>
              <props.component
                handleCardClick={handleCardClick}
                data={tokenData}
              />
            </Col>
          ))}
        </Row>
      </section>
      <Pagination
        label={I18n.t('containers.tokens.tokensPage.paginationRange', {
          to,
          total,
          from: from + 1,
        })}
        currentPage={currentPage}
        pagesCount={pagesCount}
        handlePageClick={paginate}
      />
    </>
  );
};

export default TokensList;
