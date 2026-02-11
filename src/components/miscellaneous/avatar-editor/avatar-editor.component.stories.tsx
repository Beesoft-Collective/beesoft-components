import { Meta, StoryObj } from "@storybook/react";
import { AvatarEditor } from "./avatar-editor.component.tsx";
import { AvatarEditorProps } from "./avatar-editor.props.ts";
import { ChangeEvent, useId, useState } from "react";
import { fileToBase64 } from "@beesoft/common";

const meta: Meta<typeof AvatarEditor> = {
  title: 'Misc/Avatar Editor',
  component: AvatarEditor,
};

export default meta;

type Story = StoryObj<typeof AvatarEditor>;

const Template = (args: AvatarEditorProps) => {
  document.body.className = '';

  const [preview, setPreview] = useState<string>();
  const [source, setSource] = useState<string>();
  const fileId = useId();

  const onAvatarEdit = (data?: string)=> {
    setPreview(data);
  };

  const onFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const result = await fileToBase64(event.target.files[0]);
      if (result) {
        setSource(result);
      }
    }
  };

  return (
    <div className="bsc:flex-col">
      <div>
        <input
          type="file"
          name={fileId}
          id={fileId}
          onChange={onFileSelected}
          className="bsc:invisible bsc:absolute bsc:pointer-events-none"
        />
        <label htmlFor={fileId} className="bsc:cursor-pointer">Load File</label>
      </div>
      <div className="bsc:flex">
        <div>
          <AvatarEditor {...args} source={source} onEdit={onAvatarEdit} />
        </div>
        <div>
          <img alt="Preview Image" src={preview} />
        </div>
      </div>
    </div>
  );
};

export const Default: Story = {
  args: {
    height: 250,
  },
  render: (args) => <Template {...args} />,
};
