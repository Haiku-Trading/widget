import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useEffect } from "react"
import { $createTextNode, $getRoot, $setSelection, CLEAR_EDITOR_COMMAND, COMMAND_PRIORITY_HIGH, KEY_ENTER_COMMAND } from 'lexical';
import { $isElementNode } from 'lexical';
import { $createRangeSelection } from 'lexical';
import { $createParagraphNode } from 'lexical';
import { $convertToMentionNodes } from 'lexical-beautiful-mentions';
import { getDebugTextContent } from "./utils";

// ValueSyncPlugin
type ValueSyncPluginProps = {
    value: string,
    triggers: string[]
}

export const ValueSyncPlugin: React.FC<ValueSyncPluginProps> = ({ value, triggers }) => {
    const [editor] = useLexicalComposerContext()

    useEffect(() => {
        if (editor) {
            editor.update(() => {
                const root = $getRoot()
                if (value === undefined || value === '') { root.clear(); return; }
                const currentContent = getDebugTextContent(root).iidText.trim()

                if (currentContent !== value) {
                    root.clear()
                    const paragraph = $createParagraphNode()
                    paragraph.append(...$convertToMentionNodes(value, triggers))
                    paragraph.append($createTextNode(''));
                    root.append(paragraph);

                    const lastChild = root.getLastChild()


                    if (lastChild && $isElementNode(lastChild)) {
                        const rangeSelection = $createRangeSelection()
                        rangeSelection.anchor.set(lastChild.getKey(), lastChild.getChildrenSize(), 'element')
                        rangeSelection.focus.set(lastChild.getKey(), lastChild.getChildrenSize(), 'element')
                        $setSelection(rangeSelection)
                    }
                    editor.focus(
                        () => {
                            const activeElement = document.activeElement;
                            const rootElement = editor.getRootElement() as HTMLDivElement;
                            if (
                                rootElement !== null &&
                                (activeElement === null || !rootElement.contains(activeElement))
                            ) {
                                rootElement.focus({ preventScroll: true });
                            }
                        },
                        { defaultSelection: 'rootEnd' },
                    );
                }

            })

        }
    }, [editor, value])

    return null
}

// EnterCommandPlugin
type EnterCommandPluginProps = {
    onSubmit?: () => void
}
export const EnterCommandPlugin: React.FC<EnterCommandPluginProps> = ({ onSubmit = () => { } }) => {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerCommand(
            KEY_ENTER_COMMAND,
            (event: KeyboardEvent) => {
                const { shiftKey, key } = event;

                if (key == "Enter" && shiftKey == false) {
                    const mentionsMenu = document.getElementById('mentions-menu')
                    if (mentionsMenu) {
                        return false
                    }
                    event.preventDefault();

                    onSubmit();

                    editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
                }

                return true;
            },
            COMMAND_PRIORITY_HIGH
        );
    }, [editor, onSubmit]);

    return null;
};


