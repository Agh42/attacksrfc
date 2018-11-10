
const cfg = require('dotenv').config();

module.exports = {
    plugins: [
              new webpack.DefinePlugin({
                __CVESERVICE_URL__: JSON.stringify(cfg.parsed.CVESERVICE_URL),
              })
            ]
}