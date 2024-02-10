import { JsonItem, MakeRequired, TypeOrArray } from '@beesoft/common';
import { TemplateFunction } from '../../../common/template-outlet/template-outlet.component.tsx';
import { FormInputControlData } from '../../form-control.interface.ts';
import { FormGroupItemOrientation, GroupChangeEvent } from '../../form-generic.interfaces.ts';

export interface GroupButtonProps
  extends MakeRequired<FormInputControlData<TypeOrArray<unknown>, GroupChangeEvent>, 'name'> {
  orientation?: FormGroupItemOrientation;
  isMultiSelect?: boolean;
  itemTemplate?: GroupButtonItemTemplate;
}

export interface GroupButtonItemTemplateProps {
  itemId: string;
  itemText: string;
  itemValue: string | number;
  itemData: JsonItem;
  isFirstItem: boolean;
  isLastItem: boolean;
}

export type GroupButtonItemTemplate = TemplateFunction<GroupButtonItemTemplateProps>;
