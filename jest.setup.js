// jest.setup.js
import '@testing-library/jest-dom';

// You can add other global setup configurations here if needed
// For example, mocking global objects or functions:
/*
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn()
      },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => null)
    };
  },
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // next/image props are not all standard img props
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));
*/
