import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";

import favicon1 from "../images/favicon_1.ico";
import favicon2 from "../images/favicon_2.ico";
import favicon3 from "../images/favicon_3.ico";
import favicon4 from "../images/favicon_4.ico";

const FAVICONS = [favicon1, favicon2, favicon3, favicon4];
const FAVICON = FAVICONS[Math.floor(Math.random() * FAVICONS.length)];

export default class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.func,
  };

  render() {
    const { children } = this.props;

    return (
      <div className="layouts-index">
        <Helmet>
          <title>proto.sh</title>
          <link rel="shortcut icon" href={FAVICON} />
          <meta name="description" content="Prototypes by Carl Sverre" />
          <meta name="keywords" content="carl, sverre, prototype, proto" />
          <meta
            name="google-site-verification"
            content="0NUbfbXHDOCrUb-Noo2f4F6Dh_XiqxtfwoE8lj-zF8w"
          />
        </Helmet>
        {children}
      </div>
    );
  }
}
