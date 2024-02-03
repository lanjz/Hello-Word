import { Extension } from '@tiptap/core'

export const SpaceEnterBreakExtension = Extension.create({
  name: 'spaceEnterBreak',

  addKeyboardShortcuts() {
    return {
      'Enter': ({ editor }) => {
        // 检查当前选择之前的字符是否为空格
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;

        // 如果当前光标前一个字符是空格，则执行 setHardBreak
        if ($from.nodeBefore && $from.nodeBefore.text.endsWith(' ')) {
          return editor.commands.setHardBreak();
        }
        // 否则，执行默认的回车键行为
        return false;
      },
    }
  },
})
