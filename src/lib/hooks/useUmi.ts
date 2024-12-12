// hooks/useUmi.ts
import { useMemo } from 'react';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { web3JsEddsa } from '@metaplex-foundation/umi-eddsa-web3js';
import { mplHybrid } from '@metaplex-foundation/mpl-hybrid';
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox';
import { mplCore } from '@metaplex-foundation/mpl-core';

export const useUmi = () => {
  return useMemo(() => {
    return createUmi('https://api.devnet.solana.com')
      .use(web3JsEddsa())
      .use(mplHybrid())
      .use(mplToolbox())
      .use(mplCore());
  }, []);
};