import React, { Component } from 'react';
import { Helmet } from "react-helmet";

class HelpPage extends Component {
  render() {
    return (
      <div className="main-wrapper">
        <Helmet>
          <title>Help – DeFi Blockchain Client</title>
        </Helmet>
        <header className="header-bar">
          <h1>Help</h1>
        </header>
        <div className="content">
          <section>
            Section
          </section>
        </div>
      </div>
    );
  }
}

export default HelpPage;