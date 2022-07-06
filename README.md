<div align="center">
<img src="https://raw.githubusercontent.com/JohnAlbin/storybook-addon-fetch-mock/main/storybook-addon-fetch-mock.svg" width="382" height="250" alt="Project icon has pink arrows going between Storybook and fetch-mock" />
</div>

# storybook-addon-fetch-mock

This [Storybook.js](https://storybook.js.org/) addon adds `fetch()` mocking using [`fetch-mock`](http://www.wheresrhys.co.uk/fetch-mock/).

## Why use storybook-addon-fetch-mock?

If you are already using [Storybook.js](https://storybook.js.org/), you may have components that call API endpoints. And to ensure your component Storybook documentation isn’t dependent on those API endpoints being available, you’ll want to mock any calls to those API endpoints. This is doubly true if any of your components alter data on the endpoint.

Fortunately, the Storybook ecosystem has many addons to make mocking APIs easier. Any of these addons will allow you to intercept the real API calls in your components and return any mocked data response you’d like.

- If you use **Service Workers**, you’ll want to evaluate the [Mock Service Worker addon](https://storybook.js.org/addons/msw-storybook-addon/).
- If you use **GraphQL**, you’ll want to evaluate the [Apollo Client addon](https://storybook.js.org/addons/storybook-addon-apollo-client/).
- If you use **XMLHttpRequest (XHR)**, you’ll want to evaluate the [Mock API Request addon](https://storybook.js.org/addons/storybook-addon-mock/). This addon also mocks
  fetch, but its capabilities are very basic.
- Lastly, if you use **Fetch API**, this project, storybook-addon-fetch-mock, is a light wrapper around the `fetch-mock` library, a well-maintained, highly-configurable mocking library.

## A quick example

Imagine a `UnicornSearch` component that uses `fetch()` to call an endpoint to search for a list of unicorns. You can use the `storybook-addon-fetch-mock` to bypass the actual API endpoint and return a mocked response. After following the “Installation” instructions below, you could configure `UnicornSearch.stories.js` like this:

```js
import UnicornSearch from './UnicornSearch';

export default {
  title: 'Unicorn Search',
  component: UnicornSearch,
};

// We define the story here using CSF 3.0.
export const ShowMeTheUnicorns = {
  args: {
    search: '',
  },
  parameters: {
    fetchMock: {
      // "fetchMock.mocks" is a list of mocked
      // API endpoints.
      mocks: [
        {
          // The "matcher" determines if this
          // mock should respond to the current
          // call to fetch().
          matcher: {
            name: 'searchSuccess',
            url: 'path:/unicorn/list',
            query: {
              search: 'Charlie',
            },
          },
          // If the "matcher" matches the current
          // fetch() call, the fetch response is
          // built using this "response".
          reponse: {
            status: 200,
            body: {
              count: 1,
              unicorns: [
                {
                  name: 'Charlie',
                  location: 'magical Candy Mountain',
                },
              ],
            },
          },
        },
        {
          matcher: {
            name: 'searchFail',
            url: 'path:/unicorn/list',
          },
          reponse: {
            status: 200,
            body: {
              count: 0,
              unicorns: [],
            },
          },
        },
      ],
    },
  },
};
```

If we open the “Show Me The Unicorns” story in Storybook, we can fill out the “search” field with “Charlie” and, assuming `UnicornSearch` calls `fetch()` to `https://example.com/unicorn/list?search=charlie`, our Storybook addon will compare each mock in `parameters.fetchMock.mocks` until it finds a match and will return the first mock’s response.

If we fill out the “search” field with a different value, our Storybook addon will return the second mock’s response.

## Installation

1. Install the addon as a dev dependency:

   ```shell
   npm i -D storybook-addon-fetch-mock
   ```

2. Register the Storybook addon by adding its name to the addons array in `.storybook/main.js`:

   ```js
   module.exports = {
     addons: ['storybook-addon-fetch-mock'],
   };
   ```

3. Optionally, configure the addon by adding a `fetchMock` entry to the `parameters` object in `.storybook/preview.js`. See the “Configure global parameters for all stories” section below for details.

4. Add mock data to your stories. See the “Configure mock data” section below for details.

## Configure mock data

To intercept the `fetch` calls to your API endpoints, add a `parameters.fetchMock.mocks` array containing one or more endpoint mocks.

### Where do the parameters go?

If you place the `parameters.fetchMock.mocks` array inside a single story’s export, the mocks will apply to just that story:

```js
export const MyStory = {
  parameters: {
    fetchMock: {
      mocks: [
        // ...mocks go here
      ],
    },
  },
};
```

If you place the `parameters.fetchMock.mocks` array inside a Storybook file’s `default` export, the mocks will apply to all stories in that file. But, if you need to, you can still override the mocks per story.

```js
export default {
  title: 'Components/Unicorn Search',
  component: UnicornSearch,
  parameters: {
    fetchMock: {
      mocks: [
        // ...mocks go here
      ],
    },
  },
};
```

You can also place the `parameters.fetchMock.mocks` array inside Storybook’s `preview.js` configuration file, but that isn’t recommended. For better alternatives, see the “Configure global parameters for all stories” section below.

### The `parameters.fetchMock.mocks` array

When a call to `fetch()` is made, each mock in the `parameters.fetchMock.mocks` array is compared to the `fetch()` request until a match is found.

Each mock should be an object containing the following possible keys:

- `matcher` (required): Each mock’s `matcher` object has one or more criteria that is used to match. If multiple criteria are included in the `matcher` all of the criteria must match in order for the mock to be used.
- `response` (optional): Once the match is made, the matched mock’s `response` is used to configure the `fetch()` response.
  - If the mock does not specify a `response`, the `fetch()` response will use a HTTP 200 status with no body data.
  - If the `response` is an object, those values are used to create the `fetch()` response.
  - If the `response` is a function, the function should return an object whose values are used to create the `fetch()` response.
- `options` (optional): Further options for configuring mocking behaviour.

Here’s the full list of possible keys for `matcher`, `response`, and `options`:

```js
const exampleMock = {
  // Criteria for deciding which requests should match this
  // mock. If multiple criteria are included, all of the
  // criteria must match in order for the mock to be used.
  matcher: {
    // Match only requests where the endpoint "url" is matched
    // using any one of these formats:
    // - "url" - Match an exact url.
    //     e.g. "http://www.site.com/page.html"
    // - "*" - Match any url
    // - "begin:..." - Match a url beginning with a string,
    //     e.g. "begin:http://www.site.com"
    // - "end:..." - Match a url ending with a string
    //     e.g. "end:.jpg"
    // - "path:..." - Match a url which has a given path
    //     e.g. "path:/posts/2018/7/3"
    // - "glob:..." - Match a url using a glob pattern
    //     e.g. "glob:http://*.*"
    // - "express:..." - Match a url that satisfies an express
    //     style path. e.g. "express:/user/:user"
    // - RegExp - Match a url that satisfies a regular
    //     expression. e.g. /(article|post)\/\d+/
    url: 'https://example.com/endpoint/search',

    // If you have multiple mocks that use the same "url",
    // a unique "name" is required.
    name: 'searchSuccess',

    // Match only requests using this HTTP method. Not
    // case-sensitive.
    method: 'POST',

    // Match only requests that have these headers set.
    headers: {
      Authorization: 'Basic 123',
    },

    // Match only requests that send a JSON body with the
    // exact structure and properties as the one provided.
    // See matcher.matchPartialBody below to override this.
    body: {
      unicornName: 'Charlie',
    },

    // Match calls that only partially match the specified
    // matcher.body JSON.
    matchPartialBody: true,

    // Match only requests that have these query parameters
    // set (in any order).
    query: {
      q: 'cute+kittenz',
    },

    // When the express: keyword is used in the "url"
    // matcher, match only requests with these express
    // parameters.
    params: {
      user: 'charlie',
    },

    // Match if the function returns something truthy. The
    // function will be passed the url and options fetch was
    // called with. If fetch was called with a Request
    // instance, it will be passed url and options inferred
    // from the Request instance, with the original Request
    // will be passed as a third argument.
    functionMatcher: (url, options, request) => {
      return !!options.headers.Authorization;
    },

    // Limits the number of times the mock can be matched.
    // If the mock has already been used "repeat" times,
    // the call to fetch() will fall through to be handled
    // by any other mocks.
    repeat: 1,
  },

  // Configures the HTTP response returned by the mock.
  reponse: {
    // The mock response’s "statusText" is automatically set
    // based on this "status" number. Defaults to 200.
    status: 200,

    // By default, the optional "body" object will be converted
    // into a JSON string. See options.sendAsJson to override.
    body: {
      unicorns: true,
    },

    // Set the mock response’s headers.
    headers: {
      'Content-Type': 'text/html',
    },

    // The url from which the mocked response should claim
    // to originate from (to imitate followed directs).
    // Will also set `redirected: true` on the response.
    redirectUrl: 'https://example.com/search',

    // Force fetch to return a Promise rejected with the
    // value of "throws".
    throws: new TypeError('Failed to fetch'),
  },

  // Alternatively, the `response` can be a function that
  // returns an object with any of the keys above. The
  // function will be passed the url and options fetch was
  // called with. If fetch was called with a Request
  // instance, it will be passed url and options inferred
  // from the Request instance, with the original Request
  // will be passed as a third argument.
  reponse: (url, options, request) => {
    return {
      status: options.headers.Authorization ? 200 : 403,
    };
  },

  // An object containing further options for configuring
  // mocking behaviour.
  options: {
    // If set, the mocked response is delayed for the
    // specified number of milliseconds.
    delay: 500,

    // By default, the "body" object is converted to a JSON
    // string and the "Content-Type: application/json"
    // header will be set on the mock response. If this
    // option is set to false, the "body" object can be any
    // of the other types that fetch() supports, e.g. Blob,
    // ArrayBuffer, TypedArray, DataView, FormData,
    // URLSearchParams, string or ReadableStream.
    sendAsJson: false,

    // By default, a Content-Length header is set on each
    // mock response. This can be disabled when this option
    // is set to false.
    includeContentLength: false,
  },
};
```

## Configure global parameters for all stories

The following options are designed to be used in Storybook’s `preview.js` config file.

```js
// .storybook/preview.js
export const parameters = {
  fetchMock: {
    // When the story is reloaded (or you navigate to a new
    // story, this addon will be reset and a list of
    // previous mock matches will be sent to the browser’s
    // console if "debug" is true.
    debug: true,

    // Do any additional configuration of fetch-mock, e.g.
    // setting fetchMock.config or calling other fetch-mock
    // API methods. This function is given the fetchMock
    // instance as its only parameter and is called after
    // mocks are added but before catchAllMocks are added.
    useFetchMock: (fetchMock) => {
      fetchMock.config.overwriteRoutes = false;
    },

    // After each story’s `mocks` are added, these catch-all
    // mocks are added.
    catchAllMocks: [
      { matcher: { url: 'path:/endpoint1' }, response: 200 },
      { matcher: { url: 'path:/endpoint2' }, response: 200 },
    ],

    // A simple list of URLs to ensure that calls to
    // `fetch( [url] )` don’t go to the network. The mocked
    // fetch response will use HTTP status 404 to make it
    // easy to determine one of the catchAllURLs was matched.
    // These mocks are added after any catchAllMocks.
    catchAllURLs: [
      // This is equivalent to the mock object:
      // {
      //   matcher: { url: 'begin:http://example.com/' },
      //   response: { status: 404 },
      // }
      'http://example.com/',
    ],
  },
};
```
