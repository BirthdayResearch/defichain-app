import React, { Component } from 'react';
import { Helmet } from "react-helmet";

class MasternodesPage extends Component {
  render() {
    return (
      <div>
        <Helmet>
          <title>Masternodes – DeFi Blockchain Client</title>
        </Helmet>
        <header className="header-bar">
          <h1>Masternodes</h1>
        </header>
        <div className="content">
          <section>
            Section
          </section>
        </div>
        <footer className="footer-bar">
          Footer Bar
        </footer>
      </div>
    );
  }
}

export default MasternodesPage;