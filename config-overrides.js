const { override, addPostcssPlugins, addLessLoader, addBabelPlugin, fixBabelImports } = require('customize-cra');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
// const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
// const child_process = require('child_process');

// function getVersion() {
//   return new Promise((resolve, reject) => {
//     child_process.exec('git name-rev --name-only HEAD', { encoding: 'utf8' }, (error, stdout, status, output) => {
//       error ? reject(error) : resolve(stdout);
//     });
//   });
// }

// const spm = new SpeedMeasureWebpackPlugin();

function addCustomize(config) {
  if (process.env.NODE_ENV === 'production') {
    // 关闭sourceMap
    config.devtool = false;
    // 配置打包后的文件位置
    // config.output.path = resolve('dist');
    // config.output.publicPath = pkg.homepage;
    // 分割代码
    config.optimization.splitChunks = {
      chunks: 'all',
      // 多模块入口 提取公共依赖
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial',
        },
        // antdMobile: {
        //   chunks: 'all',
        //   name: 'antd-mobile', //分离ui框架 split antd-mobile into a single package
        //   priority: -5, // 权重 the weight needs to be larger than libs and app or it will be packaged into libs or app
        //   test: /[\\/]node_modules[\\/](@ant-design|antd|antd-mobile)[\\/]/,
        //   reuseExistingChunk: true,
        // },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    };
    // 添加js打包gzip配置
    config.externals = {
      react: 'React',
      'react-dom': 'ReactDOM',
      'react-router': 'ReactRouter',
      'react-router-dom': 'ReactRouterDOM',
    };
    config.plugins.push(
      new CompressionWebpackPlugin({
        filename: '[file].gz[query]',
        algorithm: 'gzip',
        test: /\.js$|\.css$/,
        threshold: 10240, // 对超过10k的数据进行压缩
        minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
      })
    );

    config.plugins.push(new WebpackManifestPlugin());

    config.plugins.forEach((plugin) => {
      if (plugin.constructor.name === 'HtmlWebpackPlugin') {
        plugin.options.production = true;
      }
    });

    config.plugins.push(new BundleAnalyzerPlugin({ analyzerPort: 8919 }));
  }
  return config;
}

module.exports = {
  webpack: override(
    addLessLoader({
      javascriptEnabled: true,
      localIdentName: '[local]--[contenthash:base64:5]', // 自定义 CSS Modules 的 localIdentName
    }),
    addPostcssPlugins([
      require('postcss-flexbugs-fixes')('import', {
        libraryName: 'antd-mobile',
        libraryDirectory: 'es',
        style: true,
      }),
      require('postcss-preset-env')({
        autoprefixer: {
          flexbox: 'no-2009',
        },
        stage: 3,
      }),
      require('postcss-px-to-viewport')({
        viewportWidth: 375,
        unitPrecision: 3,
        viewportHeight: 1334,
        viewportUnit: 'vw',
        selectorBlackList: ['.ignore', '.hairlines'],
        minPixelValue: 1,
        mediaQuery: false,
      }),
      require('cssnano')({
        preset: 'advanced',
        autoprefixer: false,
        zindex: false,
      }),
    ]),
    addBabelPlugin(['import', { libraryName: 'antd-mobile', libraryDirectory: 'es/components', style: false }]),
    fixBabelImports('lodash', {
      libraryDirectory: '',
      camel2DashComponentName: false,
    }),
    addCustomize
  ),
};
