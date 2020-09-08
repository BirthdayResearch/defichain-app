import React from 'react';
import { CSVReader } from 'react-papaparse';
import { I18n } from 'react-redux-i18n';
import { MdGridOn } from 'react-icons/md';
import { Button } from 'reactstrap';

interface CsvReaderProps {
  handleOnDrop: (data, file?) => void;
  handleOnError: (err, file?, inputElem?, reason?) => void;
  handleOnRemoveFile: (data) => void;
}

const CsvReader: React.FunctionComponent<CsvReaderProps> = (
  props: CsvReaderProps
) => {
  return (
    <>
      <CSVReader
        style={{
          border: 'solid 1px #000000',
        }}
        onDrop={props.handleOnDrop}
        onError={props.handleOnError}
        addRemoveButton
        onRemoveFile={props.handleOnRemoveFile}
      >
        <div className='p-5 text-center'>
          <MdGridOn
            style={{
              width: '52px',
              height: '52px',
            }}
          />
          <div className='my-4 text-primary'></div>
          <span>
            {I18n.t('containers.tokens.dctDistribution.dragAndUploadCSV')}
          </span>
          <div className='my-3'>
            <Button color='primary'>
              {I18n.t('containers.tokens.dctDistribution.chooseFile')}
            </Button>
          </div>
        </div>
      </CSVReader>
    </>
  );
};

export default CsvReader;
