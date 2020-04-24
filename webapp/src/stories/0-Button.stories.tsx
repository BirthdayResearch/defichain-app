import React from "react";
import "../app/App.scss";
import { Button } from "reactstrap";
import { MdArrowUpward, MdArrowDownward } from "react-icons/md";

export default {
  title: "Button",
};

export const Colors = () => (
  <div className="container mt-5">
    <Button color="primary">Primary</Button>
    <Button color="secondary">Secondary</Button>
    <Button color="success">Sucess</Button>
    <Button color="info">Info</Button>
    <Button color="warning">Warning</Button>
    <Button color="danger">Danger</Button>
    <Button color="link">Link</Button>
  </div>
);

export const Sizes = () => (
  <div className="container mt-5">
    <Button color="primary" size="sm">
      Small
    </Button>
    <Button color="primary">Default</Button>
  </div>
);

export const Icons = () => (
  <div className="container mt-5">
    <Button color="link" size="sm">
      <MdArrowUpward />
      <span className="d-md-inline">Send</span>
    </Button>
    <Button color="link" size="sm">
      <MdArrowDownward />
      <span className="d-md-inline">Receive</span>
    </Button>
  </div>
);
