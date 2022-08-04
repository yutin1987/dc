import map from 'lodash/map';
import debounce from 'lodash/debounce';
import axios from 'axios';
import React from 'react';
import PropTypes from 'prop-types';
import useSWRInfinite from 'swr/infinite';
import NoResults from '../NoResults';
import Loader from '../Loader';
import styles from './SearchResults.module.scss';

const getKey = (keyword) => (pageIndex, previousPageData) => {
  if (previousPageData && previousPageData.length < 30) return null;
  return `q=${keyword}&page=${pageIndex + 1}`;
};

async function fetcher(key) {
  const result = await axios.get(`/api/repositories?${key}`);
  return result.data.items;
}

export default function SearchResults({ keyword }) {
  const {
    data, error, isValidating, size, setSize,
  } = useSWRInfinite(getKey(keyword), fetcher);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleScroll = React.useCallback(debounce(async (e) => {
    if (isValidating === true) return;
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) setSize(size + 1);
  }, 1000, { maxWait: 2000 }), [size, isValidating]);

  const items = React.useMemo(() => {
    const results = [];
    map(data, (page) => {
      map(page, (item) => {
        let idx = results.length - 1;
        const min = Math.max(0, idx - 30);
        for (; idx > min; idx -= 1) {
          if (results[idx].id === item.id) {
            results[idx] = item;
            return;
          }
        }
        results.push(item);
      });
    });
    return results;
  }, [data]);

  return (
    <div className={styles.container} onScroll={handleScroll}>
      <div className={styles.wrapper}>
        {map(items, (item) => (
          <a key={item.full_name} className={styles.repository} href={item.html_url} target="repository">
            <div className={styles.repositoryName}>{item.full_name}</div>
            <div className={styles.repositoryLanguage}>{item.language}</div>
            <div className={styles.repositoryDescription}>{item.description}</div>
          </a>
        ))}
      </div>
      {error ? (
        <div className={styles.error}>{error.message}</div>
      ) : (
        items.length < 1 && isValidating === false && !error && <NoResults />
      )}
      <div className={styles.loader}>
        {isValidating && <Loader />}
      </div>
    </div>
  );
}

SearchResults.defaultProps = {
  keyword: '',
};

SearchResults.propTypes = {
  keyword: PropTypes.string,
};
