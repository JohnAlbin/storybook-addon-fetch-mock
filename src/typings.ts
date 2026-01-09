import type { RouteMatcher, RouteResponse, UserRouteConfig } from "fetch-mock";

export interface MockObject {
  matcher: RouteMatcher;
  response?: RouteResponse;
  options?: UserRouteConfig;
}

export type MockArray = [RouteMatcher, RouteResponse?, UserRouteConfig?];

export type Mock = MockObject | MockArray;

export interface WithFetchMockParameters {
  parameters: {
    fetchMock: {
      mocks: MockObject[];
    };
  };
}
