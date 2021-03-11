import React from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { MdFirstPage, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import styles from './CustomPagination.module.scss';

interface ICustomPaginationComponentProps {
  data: any[];
  currentPage: number;
  pagesCount: number;
  label?: string;
  handlePageClick: (index: number, token: string | undefined) => void;
  showNextOnly?: boolean;
  disableNext?: boolean;
  cancelToken?: any;
}

const CustomPaginationComponent: React.FunctionComponent<ICustomPaginationComponentProps> = (
  props: ICustomPaginationComponentProps
) => {
  const disableNextLink = () => {
    if (props.disableNext === undefined) return currentPage >= pagesCount;
    return props.disableNext;
  };

  const { currentPage, pagesCount, data, label } = props;
  return (
    <div className='d-flex text-right justify-content-between align-items-center mt-3'>
      <div>{label}</div>
      <Pagination className={styles.pagination}>
        {!props.showNextOnly && (
          <PaginationItem disabled={currentPage <= 1}>
            <PaginationLink
              first
              onClick={(e) => props.handlePageClick(1, props.cancelToken)}
            >
              <MdFirstPage />
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem disabled={currentPage <= 1}>
          <PaginationLink
            previous
            onClick={(e) =>
              props.handlePageClick(currentPage - 1, props.cancelToken)
            }
          >
            <MdChevronLeft />
          </PaginationLink>
        </PaginationItem>
        <PaginationItem key={currentPage} active={true}>
          <PaginationLink
            onClick={(e) =>
              props.handlePageClick(currentPage, props.cancelToken)
            }
          >
            {currentPage}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem disabled={disableNextLink() || data.length < 10}>
          <PaginationLink
            next
            onClick={(e) =>
              props.handlePageClick(currentPage + 1, props.cancelToken)
            }
            disabled={props.disableNext}
          >
            <MdChevronRight />
          </PaginationLink>
        </PaginationItem>
      </Pagination>
    </div>
  );
};

export default CustomPaginationComponent;
