import * as React from 'react';

declare module 'react' {
  export type StatelessComponent<P = {}> = React.FunctionComponent<P>;
} 