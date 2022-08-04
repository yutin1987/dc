import debounce from 'lodash/debounce';
import React from 'react';
import Head from 'next/head';
import SearchResults from '../components/SearchResults';
import styles from '../styles/index.module.scss';

export default function Index() {
  const [search, setSearch] = React.useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onChange = React.useCallback(debounce(async (e) => {
    const { value } = e.target;
    setSearch(value);
  }, 2000, { maxWait: 3000 }), []);

  return (
    <>
      <Head>
        <title>GitHub Repositories Searcher</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.searchCard}>
          <h2>Search</h2>
          <input type="search" name="search" onChange={onChange} />
        </div>
        {search && <SearchResults keyword={search} />}
      </div>
    </>
  );
}
