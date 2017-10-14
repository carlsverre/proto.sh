import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";

import "./index.scss";

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
                    <meta
                        name="description"
                        content="Prototypes by Carl Sverre"
                    />
                    <meta
                        name="keywords"
                        content="carl, sverre, prototype, proto"
                    />
                    <meta
                        name="google-site-verification"
                        content="0NUbfbXHDOCrUb-Noo2f4F6Dh_XiqxtfwoE8lj-zF8w"
                    />
                </Helmet>
                {children()}
            </div>
        );
    }
}