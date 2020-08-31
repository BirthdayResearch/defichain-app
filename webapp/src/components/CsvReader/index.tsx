import React from 'react';
import { CSVReader } from 'react-papaparse';
import { I18n } from 'react-redux-i18n';

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
        onDrop={props.handleOnDrop}
        onError={props.handleOnError}
        addRemoveButton
        onRemoveFile={props.handleOnRemoveFile}
      >
        <span>
          {I18n.t('containers.tokens.dctDistribution.dragAndUploadCSV')}
        </span>
      </CSVReader>
    </>
  );
};

export default CsvReader;
