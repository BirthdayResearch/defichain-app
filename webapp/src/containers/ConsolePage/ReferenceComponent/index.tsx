import React from 'react';
import { Label, Input } from 'reactstrap';
import styles from '../Console.module.scss';

interface ReferenceComponentProps {
  title: string;
  highlightText: string;
  cmdText: string;
}

const Reference = (props: ReferenceComponentProps) => {
  return (
    <div className={styles.exampleComponent}>
      <h2>
        <Label>{props.title}</Label>
      </h2>
      <p className={styles.exampleHighlight}>{props.highlightText}</p>
      <Input className={styles.consoleCmd} readOnly value={props.cmdText} />
    </div>
  );
};

export default Reference;
