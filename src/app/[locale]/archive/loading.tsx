import React from 'react';

import { ItemCardLoading } from '@/components/ItemCard';

const Loading = () => {
  return (
    <main>
      <h1>Archive</h1>
      <section className="mt-4 grid gap-2">
        <ItemCardLoading />
        <ItemCardLoading />
        <ItemCardLoading />
        <ItemCardLoading />
        <ItemCardLoading />
      </section>
    </main>
  );
};

export default Loading;
