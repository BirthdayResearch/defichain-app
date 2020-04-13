import React, { Component } from "react";
import { Helmet } from "react-helmet";
import ChaplinGif from "../../assets/gif/chaplin.gif";
import { Row, Col, Button } from "reactstrap";
import styles from "./ErrorPage.module.scss";
import { I18n } from "react-redux-i18n";

class Error404Page extends Component<any, any> {
  render() {
    const chaplinStyle = {
      backgroundImage: "url(" + ChaplinGif + ")",
      backgroundSize: "cover",
    };
    return (
      <div className="main-wrapper">
        <Helmet>
          <title>{I18n.t("containers.errors.title")}</title>
        </Helmet>
        <header className="header-bar">
          <h1>{I18n.t("containers.errors.header")}</h1>
        </header>
        <div className="content" style={chaplinStyle}></div>
        <footer className={`footer-bar ${styles.dark}`}>
          <Row className="justify-content-between align-items-center">
            <Col>
              <p>{I18n.t("containers.errors.detail")}</p>
            </Col>
            <Col className="col-auto">
              <Button color="primary" onClick={this.props.history.goBack}>
                {I18n.t("containers.errors.goBack")}
              </Button>
            </Col>
          </Row>
        </footer>
      </div>
    );
  }
}

export default Error404Page;
