const autoprefixer = require("autoprefixer");
const path = require("path");

module.exports = {
    siteMetadata: {
        title: "Proto.sh",
    },
    plugins: [
        "gatsby-plugin-react-helmet",
        {
            resolve: "gatsby-plugin-postcss-sass",
            options: {
                includePaths: [path.resolve(__dirname, "src")],
                postCssPlugins: [autoprefixer()],
            },
        },
        {
            resolve: `gatsby-plugin-google-fonts`,
            options: {
                fonts: [`roboto`],
            },
        },
    ],
};
