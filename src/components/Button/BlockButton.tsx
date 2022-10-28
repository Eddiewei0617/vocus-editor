import { useSlate } from "slate-react";
import { Button, Icon } from "../BaseComponents";
import { isBlockActive } from "../../plugins/helpers/isBlockActive";
import { toggleBlock } from "../../plugins/helpers/toggleBlock";
import { unwrapLink } from "../../plugins/helpers/unwrapLink";
import { addAnchor } from "../../plugins/helpers/insertAnchor";
import { isUrl } from "../../util/isUrl";
import { isImageUrl } from "../../util/isImageUrl";
import { css, cx } from "@emotion/css";
import Description from "../Description/Description";
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];
interface ButtonProps {
  format: string;
  icon: string;
  callback?: Function[];
  className?: string;
  description: string;
}
const BlockButton = ({
  format,
  icon,
  callback,
  description,
  className,
}: ButtonProps) => {
  const editor = useSlate();
  return (
    <Button
      className={css`
        position: relative;
        &:hover {
          .tag {
            display: block;
          }
        }
      `}
      active={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
      )}
      onMouseDown={(event: React.MouseEvent) => {
        event.preventDefault();
        if (icon === "link_off") {
          if (isBlockActive(editor, "link")) {
            return unwrapLink(editor);
          }
        }
        if (format === "link") {
          const url = window.prompt("Enter the URL of the link:");
          if (!url || !isUrl(url)) {
            alert("Not a valid input!");
            return;
          }
          return toggleBlock(editor, format, url);
        }
        if (format === "video") {
          const url = window.prompt("Enter the URL of the image:");
          if (!url) {
            alert("Not a valid input!");
            return;
          }
          return toggleBlock(editor, format, url);
        }
        if (format === "sub-title") {
          console.log("sub-title");
        }
        if (format === "anchor") {
          const anchorId = Math.random().toString();
          return addAnchor(editor, anchorId, callback![0], callback![1]);
        }
        if (format === "embed") {
          const url = window.prompt("Enter the URL of the Instagram post:");
          if (!url) {
            alert("Not a valid input!");
            return;
          }
          return toggleBlock(editor, format, url);
        }
        if (format === "table") {
          const row = window.prompt("Enter the row of the Table:");
          const column = window.prompt("Enter the column of the Table:");
          if (!row || !column) {
            alert("Not a valid input!");
            return;
          }
          if (+row <= 1 || +column <= 1) {
            alert("Row and Column must greater than 1!");
            return;
          }
          return toggleBlock(editor, format, "", +row, +column);
        }
        toggleBlock(editor, format);
      }}
    >
      <Description description={description} />
      <Icon className={className}>{icon}</Icon>
    </Button>
  );
};
export default BlockButton;
