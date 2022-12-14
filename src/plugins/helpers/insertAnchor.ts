import { Editor, Range, Element, Transforms } from "slate";
import { isBlockActive } from "./isBlockActive";
interface AddAnchorProps {
  anchorData: {
    editor: Editor;
    id: string;
    type: "heading-one" | "heading-two" | "";
  };
  anchorOperations: {
    addToList: Function;
    removeFromList: Function;
  };
}

const findOriginalId = (editor: Editor) => {
  const { selection } = editor;
  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection as any),
      match: (n, path) => {
        return !Editor.isEditor(n) && path.length === 1;
      },
    })
  );
  const id = (match[0] as any).id;
  return !!match && id;
};

export const addAnchor = (props: AddAnchorProps) => {
  const { editor, id, type } = props.anchorData;
  const { addToList, removeFromList } = props.anchorOperations;
  const { selection } = editor;
  // const isCollapsed = selection && Range.isCollapsed(selection);
  if (!selection) return false;
  if (selection.anchor.path[0] !== selection.focus.path[0]) {
    return;
  }
  const originalId = findOriginalId(editor);
  console.log("originalId", originalId);
  console.log("newId", id);
  console.log(selection.anchor.path);
  console.log(selection.focus.path);
  const order = selection.anchor.path[0];
  if (type === "heading-one") {
    addToList({ id, type, order, name: type + "-" + order });
  } else if (type === "heading-two") {
    removeFromList(originalId);
    addToList({ id, type, order, name: type + "-" + order });
  } else {
    removeFromList(originalId);
  }
};
