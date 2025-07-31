import type { NextConfig } from 'next';
import type { Configuration } from 'webpack';

const nextConfig: NextConfig = {
  webpack(config: Configuration) {
    config.output = {
      ...config.output,
      globalObject: 'self', // required for Web Workers
    };

    config.module?.rules?.push({
      test: /\.worker\.ts$/,
      use: {
        loader: 'worker-loader',
        options: { type: 'module' },
      },
    });

    return config;
  },
  experimental: {
    esmExternals: 'loose',
  },
};

export default nextConfig;
