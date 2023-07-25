import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import qs, { ParseOptions, StringifyOptions, StringifiableRecord } from 'query-string';

type StringifyQueryParams = (newQueryParams: StringifiableRecord) => string;

const options: ParseOptions | StringifyOptions = {
  arrayFormat: 'bracket-separator',
  arrayFormatSeparator: ',',
};

const useQueryParams = () => {
  const { search } = useLocation();

  const queryParams = useMemo(() => qs.parse(search, options), [search]);

  const stringifyQueryParams = useCallback<StringifyQueryParams>(
    (newQueryParams: StringifiableRecord) => qs.stringify(newQueryParams, options),
    [],
  );

  return { queryParams, stringifyQueryParams };
};

export { useQueryParams };
export type { StringifiableRecord, StringifyQueryParams };
