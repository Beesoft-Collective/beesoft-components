import { Meta, StoryObj } from "@storybook/react";
import { AvatarEditor } from "./avatar-editor.component.tsx";
import { AvatarEditorProps } from "./avatar-editor.props.ts";
import { useState } from "react";

const meta: Meta<typeof AvatarEditor> = {
  title: 'Misc/Avatar Editor',
  component: AvatarEditor,
};

export default meta;

type Story = StoryObj<typeof AvatarEditor>;

const Template = (args: AvatarEditorProps) => {
  document.body.className = '';

  const [preview, setPreview] = useState<string>();

  const onAvatarEdit = (data?: string)=> {
    setPreview(data);
  }

  return (
    <div className="bsc:flex">
      <div>
        <AvatarEditor {...args} onEdit={onAvatarEdit} />
      </div>
      <div>
        <img alt="Preview Image" src={preview} />
      </div>
    </div>
  );
};

export const Default: Story = {
  args: {
    height: 250,
    label: 'Click to Upload File',
  },
  render: (args) => <Template {...args} />,
};
