import { JsonData, useStateRef } from '@beesoft/common';
import { action } from '@storybook/addon-actions';
import { Meta, StoryObj } from '@storybook/react';
import { JSX, useRef, useState } from 'react';
import { Checkbox } from '../../../../form/checkboxes/checkbox/checkbox.component.tsx';
import { Button } from '../../../../navigation/buttons/button/button.component.tsx';
import { generatePagedData } from './item-scroller-test-common.ts';
import { ItemScroller } from './item-scroller.component.tsx';

const meta: Meta<typeof ItemScroller> = {
  title: 'Data/Item Scroller',
  component: ItemScroller,
};

export default meta;

type Story = StoryObj<typeof ItemScroller>;

const TestComponent = () => {
  const [scrollElement, setScrollElement] = useState<Element>();
  const [renderTrigger, setRenderTrigger, renderTriggerRef] = useStateRef(false);

  const scrollerData = useRef<JsonData>();
  const pagedData = useRef(generatePagedData(5000, 50));

  const onRequestData = (page: number) => {
    action('onRequestPageData')(page);

    const newData = pagedData.current(page);
    if (newData) {
      scrollerData.current
        ? (scrollerData.current = [...scrollerData.current, ...newData])
        : (scrollerData.current = [...newData]);

      setTimeout(() => {
        setRenderTrigger(!renderTriggerRef.current);
      }, 1000);
    }
  };

  const updateRecord = () => {
    if (scrollerData.current) {
      scrollerData.current[3] = { id: 4, name: 'Brandon Trabon' };
      setRenderTrigger(!renderTriggerRef.current);
    }
  };

  const renderScrollerMarkup = (data: JsonData, page: number) => {
    const pageMarkup: Array<JSX.Element> = [];
    for (let index = 0, length = data.length; index < length; index++) {
      const item = data[index];
      pageMarkup.push(
        <div key={`item_${page}_${index}`} className="bsc-px-1">
          <Checkbox value={item['id']} label={item['name'] as string} />
        </div>
      );
    }

    return pageMarkup;
  };

  const onScrollElementCreated = (element: Element) => {
    setScrollElement(element);
  };
  console.log('render trigger', renderTrigger);
  return (
    <div ref={(element) => element && onScrollElementCreated(element)} className="bsc-flex-col">
      <div className="bsc-pb-2">
        <Button onClick={updateRecord}>Modify Record</Button>
      </div>
      <div>
        <ItemScroller
          scrollingElement={scrollElement}
          data={scrollerData.current}
          onRequestPageData={onRequestData}
          className="bsc-max-h-[300px]"
        >
          {renderScrollerMarkup}
        </ItemScroller>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: () => <TestComponent />,
};
