import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Editable, withReact, Slate } from "slate-react";
import {
  createEditor,
  Element as SlateElement,
  Text as SlateText,
  Descendant,
} from "slate";
import { isHotkey } from "is-hotkey";
import { withHistory } from "slate-history";

import { Toolbar } from "./BaseComponents";
import { defaultValue } from "../data/defaultValue";
import { toggleMark } from "../plugins/helpers/toggleMark";
import { withPlugins } from "../plugins/withPlugins";
import CustomElement from "./Custom/CustomElement";
import CustomLeaf from "./Custom/CustomLeaf";

import BlockButton from "./Button/BlockButton";
import MarkButton from "./Button/MarkButton";
import StateButton from "./Button/ColorButton";
import { serialize, deserialize } from "../plugins/helpers/serializeHelper";
import AnchorList from "./Anchor/AnchorList";
import NavigationWrapper from "./Navigation/NavigationWrapper";
import Title from "./Title/Title";
import { css, cx } from "@emotion/css";
import Toolbar1 from "./Toolbars/Toolbar1";
import Toolbar2 from "./Toolbars/Toolbar2";
import Toolbar3 from "./Toolbars/Toolbar3";
import HoveringToolbar from "./Toolbars/HoveringToolbar";
interface HotKeyType {
  [key: string]: string;
}
const HOTKEYS: HotKeyType = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

interface ElementProps {
  attributes: any;
  children: React.ReactNode;
  element: SlateElement;
}

interface LeafProps {
  attributes: any;
  children: React.ReactNode;
  leaf: SlateText;
}
const LionEditor = () => {
  const renderElement = useCallback(
    (props: ElementProps) => <CustomElement {...props} />,
    []
  );
  const renderLeaf = useCallback(
    (props: LeafProps) => <CustomLeaf {...props} />,
    []
  );
  const editor = useMemo(() => {
    return withPlugins(withHistory(withReact(createEditor())));
  }, []);
  const initialValue = useMemo(() => {
    const localStorageContent = localStorage.getItem("content");
    const data = localStorageContent
      ? JSON.parse(localStorageContent)
      : defaultValue;
    return data;
  }, []);
  const [slateValue, setSlateValue] = useState<Descendant[]>([]);
  useEffect(() => {
    setSlateValue(initialValue);
  }, [initialValue]);
  const [anchorList, setAnchorList] = useState<{ name: string; id: string }[]>(
    () => {
      const anchor = localStorage.getItem("anchor");
      if (anchor) {
        return JSON.parse(anchor);
      }
      return [];
    }
  );
  return (
    <Slate
      editor={editor}
      value={initialValue}
      onChange={(value) => {
        const isAstChange = editor.operations.some(
          (op) => op.type !== "set_selection"
        );
        if (isAstChange) {
          const content = JSON.stringify(value);
          const anchor = JSON.stringify(anchorList);
          localStorage.setItem("content", content);
          localStorage.setItem("anchor", anchor);
          setSlateValue(value);
        }
      }}
    >
      <div
        className={css`
          position: relative;
          z-index: 0;
          margin: 0px auto;
          padding-top: 100px;
        `}
      >
        <NavigationWrapper />
        <div className="container2">
          <Title />
          <Toolbar1 />
          <Toolbar2 />
          <div
            className={css`
              width: 100%;
              max-width: 740px;
              margin: 0 auto;
            `}
          >
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              placeholder="開始寫作吧!"
              spellCheck
              autoFocus
              onKeyDown={(event) => {
                for (const hotkey in HOTKEYS) {
                  if (isHotkey(hotkey, event)) {
                    event.preventDefault();
                    const mark = HOTKEYS[hotkey];
                    toggleMark(editor, mark);
                  }
                }
              }}
            />
            {/* <Toolbar3 /> */}
            <HoveringToolbar />
          </div>
        </div>
      </div>
    </Slate>
  );
};

export default LionEditor;