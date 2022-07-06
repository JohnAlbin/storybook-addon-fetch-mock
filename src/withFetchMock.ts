import fetchMock from 'fetch-mock';
import { MockCall } from 'fetch-mock/types';
import { makeDecorator } from '@storybook/addons';
import { PARAM_KEY } from './constants';
import { Mock, MockArray, MockObject } from './typings';

/**
 * Helper function to add an array of mocks to fetch-mock.
 *
 * @param {Mock[]} mocks A list of mocks to add.
 */
function addMocks(mocks: Mock[]) {
  if (Array.isArray(mocks)) {
    mocks.forEach((mock) => {
      // Mock defined as: [ matcher, response, options ]
      if (Array.isArray(mock)) {
        fetchMock.mock(...(mock as MockArray));
        return;
      }

      const { matcher, response, options } = mock as MockObject;

      // Mock defined as: { matcher, [response], [options] }
      if (matcher) {
        fetchMock.mock(matcher, response, options);
      }
    });
  } else {
    console.warn(`fetchMock.mocks should be an array; ${typeof mocks} given.`);
  }
}

export const withFetchMock = makeDecorator({
  name: 'withFetchMock',
  parameterName: PARAM_KEY,
  // TODO: If a story doesn't have any fetchMock parameters, we still need to
  //   reset fetch-mock.
  skipIfNoParametersOrOptions: false,

  wrapper(storyFn, context, { parameters }) {
    // If requested, send debug info to the console.
    if (fetchMock.called() && parameters && parameters.debug) {
      // Construct an object that easy to navigate in the console.
      const calls: { [key: string]: MockCall } = {};
      fetchMock.calls().forEach((call) => {
        calls[call.identifier] = call;
      });

      // Send the debug data to the console.
      console.log({ 'fetch-mock matched these mocks': calls });
    }

    // Remove any mocks from fetch-mock that may have been defined by other
    // stories.
    fetchMock.reset();

    // By default, allow any fetch call not mocked to use the actual network.
    fetchMock.config.fallbackToNetwork = true;

    // Add all the mocks.
    addMocks(parameters.mocks);

    // Do any additional configuration of fetchMock, e.g. setting
    // fetchMock.config or calling other methods.
    if (typeof parameters.useFetchMock === 'function') {
      parameters.useFetchMock(fetchMock);
    }

    // Add any catch-all urls last.
    if (Array.isArray(parameters.catchAllURLs)) {
      parameters.catchAllURLs.forEach((url) => {
        fetchMock.mock(
          {
            // Add descriptive name for debugging.
            name: `catchAllURLs[ ${url} ]`,
            url: `begin:${url}`,
          },
          // Catch-all mocks will respond with 404 to make it easy to determine
          // one of the catch-all mocks was used.
          404,
        );
      });
    }

    // Render the story.
    return storyFn(context);
  },
});
