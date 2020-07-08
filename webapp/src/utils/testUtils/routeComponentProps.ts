import { createMemoryHistory, createLocation } from 'history';
import { match } from 'react-router';
const history = createMemoryHistory();
const path = `/route/:id`;
const match: match<{ id: string }> = {
  isExact: false,
  path,
  url: path.replace(':id', '1'),
  params: { id: '1' },
};

const location = createLocation(match.url);
delete history.location.key;
delete location.key;

export { history, match, location };
