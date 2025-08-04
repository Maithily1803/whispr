import type { NextConfig } from 'next';
import type { Configuration } from 'webpack';
import path from 'path';

const nextConfig: NextConfig = {
  webpack(config: Configuration) {
    config.output = {
      ...config.output,
      globalObject: 'self', // required for Web Workers
    };

    // ✅ Web Worker support for *.worker.ts files
    config.module?.rules?.push({
      test: /\.worker\.ts$/,
      use: {
        loader: 'worker-loader',
        options: {
          filename: 'static/[hash].worker.js',
        },
      },
    });

    // ✅ Ignore native C++ or build artifacts
    config.module?.rules?.push({
      test: /\.(cpp|ts)$/,
      include: [path.resolve(__dirname, 'whisper.cpp/build')],
      use: 'ignore-loader',
    });

    return config;
  },

  experimental: {
    esmExternals: 'loose',
  },
};

export default nextConfig;
