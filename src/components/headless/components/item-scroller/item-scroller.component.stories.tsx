import { JsonData } from '@beesoft/common';
import { action } from '@storybook/addon-actions';
import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Checkbox } from '../../../form/checkboxes/checkbox/checkbox.component.tsx';
import {
  data1,
  data10,
  data11,
  data12,
  data2,
  data3,
  data4,
  data5,
  data6,
  data7,
  data8,
  data9,
} from './item-scroller-test-common.ts';
import { ItemScroller } from './item-scroller.component.tsx';

const meta: Meta<typeof ItemScroller> = {
  title: 'Data/Item Scroller',
  component: ItemScroller,
};

export default meta;

type Story = StoryObj<typeof ItemScroller>;

const TestComponent = () => {
  const [scrollerData, setScrollerData] = useState<JsonData>();
  const [scrollElement, setScrollElement] = useState<Element>();

  const onRequestData = (page: number) => {
    action('onRequestPageData')(page);
    if (page === 1) {
      setTimeout(() => setScrollerData(data1), 1000);
    } else if (page === 2) {
      setTimeout(() => setScrollerData([...data1, ...data2]), 1000);
    } else if (page === 3) {
      setTimeout(() => setScrollerData([...data1, ...data2, ...data3]), 1000);
    } else if (page === 4) {
      setTimeout(() => setScrollerData([...data1, ...data2, ...data3, ...data4]), 1000);
    } else if (page === 5) {
      setTimeout(() => setScrollerData([...data1, ...data2, ...data3, ...data4, ...data5]), 1000);
    } else if (page === 6) {
      setTimeout(() => setScrollerData([...data1, ...data2, ...data3, ...data4, ...data5, ...data6]), 1000);
    } else if (page === 7) {
      setTimeout(() => setScrollerData([...data1, ...data2, ...data3, ...data4, ...data5, ...data6, ...data7]), 1000);
    } else if (page === 8) {
      setTimeout(
        () => setScrollerData([...data1, ...data2, ...data3, ...data4, ...data5, ...data6, ...data7, ...data8]),
        1000
      );
    } else if (page === 9) {
      setTimeout(
        () =>
          setScrollerData([...data1, ...data2, ...data3, ...data4, ...data5, ...data6, ...data7, ...data8, ...data9]),
        1000
      );
    } else if (page === 10) {
      setTimeout(
        () =>
          setScrollerData([
            ...data1,
            ...data2,
            ...data3,
            ...data4,
            ...data5,
            ...data6,
            ...data7,
            ...data8,
            ...data9,
            ...data10,
          ]),
        1000
      );
    } else if (page === 11) {
      setTimeout(
        () =>
          setScrollerData([
            ...data1,
            ...data2,
            ...data3,
            ...data4,
            ...data5,
            ...data6,
            ...data7,
            ...data8,
            ...data9,
            ...data10,
            ...data11,
          ]),
        1000
      );
    } else if (page === 12) {
      setTimeout(
        () =>
          setScrollerData([
            ...data1,
            ...data2,
            ...data3,
            ...data4,
            ...data5,
            ...data6,
            ...data7,
            ...data8,
            ...data9,
            ...data10,
            ...data11,
            ...data12,
          ]),
        1000
      );
    }
  };

  const renderScrollerMarkup = (data: JsonData, page: number) => {
    return data.map((item, index) => (
      <div key={`item_${page}_${index}`} className="bsc-px-1">
        <Checkbox value={item['id']} label={item['name'] as string} />
      </div>
    ));
  };

  const onScrollElementCreated = (element: Element) => {
    setScrollElement(element);
  };

  return (
    <div ref={(element) => element && onScrollElementCreated(element)}>
      <ItemScroller
        scrollingElement={scrollElement}
        data={scrollerData}
        onRequestPageData={onRequestData}
        className="bsc-max-h-[300px]"
      >
        {renderScrollerMarkup}
      </ItemScroller>
    </div>
  );
};

export const Default: Story = {
  render: () => <TestComponent />,
};
