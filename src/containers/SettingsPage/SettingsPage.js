import React, { Component } from 'react';
import { Helmet } from "react-helmet";

class SettingsPage extends Component {
  render() {
    return (
      <div>
        <Helmet>
          <title>Settings – DeFi Blockchain Client</title>
        </Helmet>
        <header className="header-bar">
          <h1>Settings</h1>
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

export default SettingsPage;