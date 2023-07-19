/** @type {import('next').NextConfig} */


const path = require('path');

/**
 * @type {import('next-react-svg').NextReactSvgConfig}
 */
const nextReactSvgConfig = {
    include: path.resolve(__dirname, 'src/icons/dice'),
};

const nextConfig = {
    transpilePackages: ['@yamb/shared',],
}

const withReactSvg = require('next-react-svg')(nextReactSvgConfig);
module.exports = withReactSvg(nextConfig);

// module.exports = nextConfig
