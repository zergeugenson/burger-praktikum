import { type ReactNode } from 'react';

export const AppHeaderSmall = ({ text }: { text: string }): ReactNode => (
  <h1 className="text text_type_main-medium mb-6">{text}</h1>
);
