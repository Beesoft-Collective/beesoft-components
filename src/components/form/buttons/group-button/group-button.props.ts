import { JsonItem, MakeRequired, TypeOrArray } from '@beesoft/common';
import { TemplateFunction } from '../../../common/template-outlet/template-outlet.component.tsx';
import { FormInputControlData } from '../../form-control.interface.ts';
import { FormGroupItemOrientation, GroupChangeEvent } from '../../form-generic.interfaces.ts';

export interface GroupButtonProps
  extends MakeRequired<FormInputControlData<TypeOrArray<string | number>, GroupChangeEvent>, 'name'> {
  orientation?: FormGroupItemOrientation;
  isMultiSelect?: boolean;
  itemTemplate?: GroupButtonItemTemplate;
}

export interface GroupButtonItemTemplateProps {
  itemId: string;
  selectedValue: TypeOrArray<string> | undefined;
  itemText: string;
  itemValue: string;
  itemData: JsonItem;
  itemStyles: string;
  isSelected: boolean;
  isFirstItem: boolean;
  isLastItem: boolean;
  onItemChanged: (value: string | number) => void;
}

export type GroupButtonItemTemplate = TemplateFunction<GroupButtonItemTemplateProps>;
